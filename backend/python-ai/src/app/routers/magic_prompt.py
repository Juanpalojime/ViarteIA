from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
import os
import logging
from groq import Groq

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()

class MagicPromptRequest(BaseModel):
    user_idea: str

@router.post("/magic-prompt")
async def generate_magic_prompt(request: MagicPromptRequest):
    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")
            
        client = Groq(api_key=api_key)
        
        # Implementation from user snippet
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b", # User specified model
            messages=[
                {
                    "role": "system",
                    "content": "You are a creative assistant. Expand the user's idea into a detailed, vivid prompt for video generation. Reply ONLY with the prompt."
                },
                {
                    "role": "user",
                    "content": request.user_idea
                }
            ],
            temperature=1,
            max_completion_tokens=8192,
            top_p=1,
            reasoning_effort="medium",
            stream=False, # Changed to False for API response simplicity
            stop=None
        )
        
        generated_text = completion.choices[0].message.content.strip()
        return {"magic_prompt": generated_text}
        
    except Exception as e:
        logger.error(f"Groq API Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
