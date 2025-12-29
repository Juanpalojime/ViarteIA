from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os

from app.routers import text_to_video, image_to_video, health

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="ViarteIA Python AI API",
    description="AI-powered video generation service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(text_to_video.router, prefix="/generate", tags=["generation"])
app.include_router(image_to_video.router, prefix="/generate", tags=["generation"])

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Starting ViarteIA Python AI API")
    
    # Environment Validation
    REQUIRED_ENV = ["S3_ACCESS_KEY", "S3_SECRET_KEY", "S3_ENDPOINT", "S3_BUCKET"]
    for env in REQUIRED_ENV:
        if not os.getenv(env):
            logger.error(f"❌ Missing critical environment variable: {env}")
            # In production, we might want to sys.exit(1), but for dev we'll just log
    
    # Setup Ngrok if token is provided
    ngrok_token = os.getenv("NGROK_AUTH_TOKEN")
    if ngrok_token:
        public_url = engine.setup_ngrok(ngrok_token)
        if public_url:
            logger.info(f"✅ Ngrok tunnel active at: {public_url}")
    
    logger.info("✅ Startup complete")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("👋 Shutting down ViarteIA Python AI API")
    # TODO: Cleanup GPU resources

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
