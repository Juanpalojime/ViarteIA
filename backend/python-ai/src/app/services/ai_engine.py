import torch
import os
import uuid
import subprocess
import gc
import threading
import numpy as np
import cv2
import shutil
import logging
from typing import List, Optional
from io import BytesIO
from PIL import Image
from diffusers import (
    CogVideoXPipeline, 
    StableVideoDiffusionPipeline,
    DPMSolverMultistepScheduler
)
from diffusers.utils import export_to_video
from realesrgan import RealESRGANer
from basicsr.archs.rrdbnet_arch import RRDBNet

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Optional FaceSwap imports
try:
    import insightface
    from insightface.app import FaceAnalysis
except ImportError:
    insightface = None

class AIEngine:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AIEngine, cls).__new__(cls)
            cls._instance._init()
        return cls._instance

    def _init(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.i2v_pipe = None
        self.t2v_pipe = None
        self.upscaler = None
        self.face_app = None
        self.face_swapper = None
        self.output_dir = "generated_videos"
        self.lock = threading.Lock()
        os.makedirs(self.output_dir, exist_ok=True)
        logger.info(f"AI Engine initialized on {self.device}")

    def _cleanup_memory(self):
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

    def setup_ngrok(self, auth_token: str):
        """Expose the API via Ngrok (useful for Colab)"""
        try:
            from pyngrok import ngrok
            ngrok.set_auth_token(auth_token)
            public_url = ngrok.connect(8000).public_url
            logger.info(f"🚀 Public URL: {public_url}")
            return public_url
        except Exception as e:
            logger.error(f"Failed to setup Ngrok: {e}")
            return None

    def load_face_models(self):
        if insightface is None:
            raise ImportError("insightface not installed")
        
        if self.face_app is None:
            logger.info("Loading InsightFace Analysis...")
            self.face_app = FaceAnalysis(name='buffalo_l', root='models', providers=['CUDAExecutionProvider', 'CPUExecutionProvider'])
            self.face_app.prepare(ctx_id=0, det_size=(640, 640))
            
        if self.face_swapper is None:
            logger.info("Loading Face Swapper Model...")
            model_path = 'models/inswapper_128.onnx'
            if not os.path.exists(model_path):
                logger.warning(f"Warning: {model_path} not found.")
            
            self.face_swapper = insightface.model_zoo.get_model(model_path, download=False, providers=['CUDAExecutionProvider', 'CPUExecutionProvider'])

    def swap_faces(self, frames, source_face_image: Image.Image):
        self.load_face_models()
        src_img_cv2 = cv2.cvtColor(np.array(source_face_image), cv2.COLOR_RGB2BGR)
        src_faces = self.face_app.get(src_img_cv2)
        if not src_faces:
            logger.warning("No face detected in source image")
            return frames
        
        source_face = src_faces[0]
        swapped_frames = []
        
        logger.info(f"Swapping faces in {len(frames)} frames...")
        for frame in frames:
            frame_cv2 = cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)
            target_faces = self.face_app.get(frame_cv2)
            res_img = frame_cv2.copy()
            for t_face in target_faces:
                res_img = self.face_swapper.get(res_img, t_face, source_face, paste_back=True)
            swapped_frames.append(Image.fromarray(cv2.cvtColor(res_img, cv2.COLOR_BGR2RGB)))
        return swapped_frames

    def load_upscaler(self):
        if self.upscaler is None:
            logger.info("Loading Real-ESRGAN Upscaler...")
            model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=2)
            self.upscaler = RealESRGANer(
                scale=2,
                model_path='https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.1/RealESRGAN_x2plus.pth',
                model=model,
                tile=400,
                tile_pad=10,
                pre_pad=0,
                half=True if self.device == "cuda" else False,
                device=self.device
            )

    def upscale_frames(self, frames):
        self.load_upscaler()
        upscaled_frames = []
        for frame in frames:
            img = cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)
            output, _ = self.upscaler.enhance(img, outscale=2)
            upscaled_frames.append(Image.fromarray(cv2.cvtColor(output, cv2.COLOR_BGR2RGB)))
        return upscaled_frames

    def load_i2v_model(self):
        if self.i2v_pipe is None:
            if self.t2v_pipe:
                del self.t2v_pipe
                self.t2v_pipe = None
                self._cleanup_memory()
            
            logger.info("Loading SVD-XT Pipeline...")
            self.i2v_pipe = StableVideoDiffusionPipeline.from_pretrained(
                "stabilityai/stable-video-diffusion-img2vid-xt", 
                torch_dtype=torch.float16, 
                variant="fp16"
            )
            # T4 Optimizations
            self.i2v_pipe.enable_model_cpu_offload()
            self.i2v_pipe.enable_sequential_cpu_offload()

    def load_t2v_model(self):
        if self.t2v_pipe is None:
            if self.i2v_pipe:
                del self.i2v_pipe
                self.i2v_pipe = None
                self._cleanup_memory()
            
            logger.info("Loading CogVideoX-2b Pipeline...")
            self.t2v_pipe = CogVideoXPipeline.from_pretrained(
                "THUDM/CogVideoX-2b", 
                torch_dtype=torch.float16
            )
            # T4 Optimizations
            self.t2v_pipe.enable_model_cpu_offload()
            self.t2v_pipe.enable_sequential_cpu_offload()

    def export_video_nvenc(self, frames, fps=24):
        temp_id = str(uuid.uuid4())
        frame_dir = os.path.join(self.output_dir, f"temp_{temp_id}")
        os.makedirs(frame_dir, exist_ok=True)
        for i, frame in enumerate(frames):
            frame.save(os.path.join(frame_dir, f"frame_{i:04d}.png"))
        
        output_path = os.path.join(self.output_dir, f"{temp_id}.mp4")
        
        # NVENC for T4
        cmd = [
            "ffmpeg", "-y", "-framerate", str(fps), "-i", os.path.join(frame_dir, "frame_%04d.png"), 
            "-c:v", "h264_nvenc", "-preset", "p4", "-tune", "hq", "-pix_fmt", "yuv420p", output_path
        ]
        
        try:
            # Added 5-minute timeout for export safety
            subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=300)
        except Exception as e:
            logger.warning(f"NVENC failed, falling back to libx264: {e}")
            subprocess.run([
                "ffmpeg", "-y", "-framerate", str(fps), "-i", os.path.join(frame_dir, "frame_%04d.png"), 
                "-c:v", "libx264", "-pix_fmt", "yuv420p", output_path
            ], check=True)
            
        shutil.rmtree(frame_dir)
        return output_path

    def generate_image_to_video(self, image: Image.Image, seed=-1, fps=24, upscale=False, face_image: Image.Image = None):
        with self.lock:
            self.load_i2v_model()
            generator = torch.manual_seed(seed) if seed != -1 else None
            
            logger.info("Starting I2V Generation...")
            frames = self.i2v_pipe(
                image, 
                decode_chunk_size=8, 
                generator=generator, 
                num_frames=25
            ).frames[0]
            
            if face_image:
                frames = self.swap_faces(frames, face_image)
            
            if upscale:
                frames = self.upscale_frames(frames)
            
            return self.export_video_nvenc(frames, fps=fps)

    def generate_text_to_video(self, prompt, negative_prompt="", num_frames=24, seed=-1, fps=24, upscale=False, face_image: Image.Image = None):
        with self.lock:
            self.load_t2v_model()
            generator = torch.manual_seed(seed) if seed != -1 else None
            
            logger.info(f"Starting T2V Generation: {prompt}")
            # Use CogVideoX-2b
            frames = self.t2v_pipe(
                prompt=prompt,
                num_frames=num_frames,
                num_inference_steps=50,
                generator=generator,
                guidance_scale=6.0
            ).frames[0]
            
            if face_image:
                frames = self.swap_faces(frames, face_image)
            
            if upscale:
                frames = self.upscale_frames(frames)
            
            return self.export_video_nvenc(frames, fps=fps)

# Global Instance
engine = AIEngine()
