from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import Optional
import asyncio
import httpx
import os
import requests
import requests
from io import BytesIO
from PIL import Image
from ..services.ai_engine import engine
from ..services.storage import upload_file

router = APIRouter()

NODE_API_URL = os.getenv("NODE_API_URL", "http://localhost:3001")

class GenerateImageRequest(BaseModel):
    id: str
    imageUrl: str
    prompt: Optional[str] = ""
    negative_prompt: Optional[str] = ""
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

def run_pipeline(job_id: str, request: GenerateImageRequest):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        loop.run_until_complete(notify_node_api(job_id, "processing", 10))
        
        print(f"Downloading source image from {request.imageUrl}")
        response = requests.get(request.imageUrl)
        response.raise_for_status()
        
        # Prepare Image for SVD (Needs specific resolution, resizing simply for MVP)
        init_image = Image.open(BytesIO(response.content)).convert("RGB")
        init_image = init_image.resize((1024, 576))
        
        # Download face image if provided
        face_img = None
        if request.faceImageUrl:
            print(f"Downloading face image from {request.faceImageUrl}")
            face_resp = requests.get(request.faceImageUrl)
            face_img = Image.open(BytesIO(face_resp.content)).convert("RGB")

        print(f"Starting I2V generation for job {job_id}")
        loop.run_until_complete(notify_node_api(job_id, "processing", 20))

        video_path = engine.generate_image_to_video(
            image=init_image,
            seed=request.seed,
            fps=request.fps or 24,
            upscale=request.upscale,
            face_image=face_img
        )
        
        loop.run_until_complete(notify_node_api(job_id, "processing", 90))
        print(f"Uploading video {video_path} to S3...")
        s3_url = upload_file(video_path, object_name=f"generations/{job_id}.mp4")
        
        if not s3_url:
            raise Exception("Failed to upload video to S3")

        loop.run_until_complete(notify_node_api(job_id, "completed", 100, result_url=s3_url))
        
        if os.path.exists(video_path):
            os.remove(video_path)
            
    except Exception as e:
        print(f"Error in I2V pipeline: {e}")
        loop.run_until_complete(notify_node_api(job_id, "failed", 0, error=str(e)))
    finally:
        loop.close()

@router.post("/image")
async def generate_image_to_video(request: GenerateImageRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(run_pipeline, request.id, request)
    return {"status": "queued", "jobId": request.id}
