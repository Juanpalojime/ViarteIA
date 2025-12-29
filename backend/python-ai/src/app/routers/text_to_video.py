from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import Optional
import asyncio
import httpx
import os
import requests
from ..services.ai_engine import engine
from ..services.storage import upload_file

router = APIRouter()

NODE_API_URL = os.getenv("NODE_API_URL", "http://localhost:3001")

class GenerateRequest(BaseModel):
    id: str
    prompt: str
    negative_prompt: Optional[str] = "distorted, low quality, blur"
    aspectRatio: Optional[str] = "16:9"
    duration: Optional[float] = 4.0
    fps: Optional[int] = 24
    seed: Optional[int] = -1
    upscale: Optional[bool] = False
    faceImageUrl: Optional[str] = None

async def notify_node_api(job_id: str, status: str, progress: int, result_url: Optional[str] = None, error: Optional[str] = None):
    webhook_url = f"{NODE_API_URL}/api/generations/webhook/update"
    payload = {
        "id": job_id,
        "status": status,
        "progress": progress
    }
    if result_url:
        payload["resultUrl"] = result_url
    if error:
        payload["error"] = error

    try:
        async with httpx.AsyncClient() as client:
            await client.post(webhook_url, json=payload)
    except Exception as e:
        print(f"Failed to notify Node API: {e}")

def run_pipeline(job_id: str, request: GenerateRequest):
    """
    Función síncrona que ejecuta el pipeline pesado.
    Será ejecutada en un thread pool por BackgroundTasks.
    """
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        # Notificar inicio
        loop.run_until_complete(notify_node_api(job_id, "processing", 10))
        
        # Download face image if provided
        face_img = None
        if request.faceImageUrl:
            print(f"Downloading face image from {request.faceImageUrl}")
            face_resp = requests.get(request.faceImageUrl)
            from PIL import Image
            from io import BytesIO
            face_img = Image.open(BytesIO(face_resp.content)).convert("RGB")

        # Generar (Bloqueante, usa GPU)
        print(f"Starting T2V generation for job {job_id}")
        video_path = engine.generate_text_to_video(
            prompt=request.prompt,
            negative_prompt=request.negative_prompt,
            num_frames=int(request.duration * 24), # Aprox, limitado por modelo
            seed=request.seed,
            upscale=request.upscale,
            face_image=face_img
        )
        
        # Subir a S3
        loop.run_until_complete(notify_node_api(job_id, "processing", 90))
        print(f"Uploading video {video_path} to S3...")
        s3_url = upload_file(video_path, object_name=f"generations/{job_id}.mp4")
        
        if not s3_url:
            raise Exception("Failed to upload video to S3")

        # Notificar éxito
        loop.run_until_complete(notify_node_api(job_id, "completed", 100, result_url=s3_url))
        
        # Cleanup
        if os.path.exists(video_path):
            os.remove(video_path)
            
    except Exception as e:
        print(f"Error in pipeline: {e}")
        loop.run_until_complete(notify_node_api(job_id, "failed", 0, error=str(e)))
    finally:
        loop.close()

@router.post("/text")
async def generate_text_to_video(request: GenerateRequest, background_tasks: BackgroundTasks):
    # Encolar la tarea pesada
    background_tasks.add_task(run_pipeline, request.id, request)
    return {"status": "queued", "jobId": request.id}
