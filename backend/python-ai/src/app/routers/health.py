from fastapi import APIRouter
import torch

router = APIRouter()

@router.get("/")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "viarteia-python-ai",
        "version": "1.0.0"
    }

@router.get("/gpu")
async def gpu_status():
    """Check GPU availability and status"""
    cuda_available = torch.cuda.is_available()
    
    if cuda_available:
        return {
            "cuda_available": True,
            "device_count": torch.cuda.device_count(),
            "current_device": torch.cuda.current_device(),
            "device_name": torch.cuda.get_device_name(0),
            "memory_allocated": torch.cuda.memory_allocated(0),
            "memory_reserved": torch.cuda.memory_reserved(0),
        }
    else:
        return {
            "cuda_available": False,
            "message": "CUDA not available, using CPU"
        }
