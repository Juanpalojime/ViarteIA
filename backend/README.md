# ViarteIA Backend Ecosystem

## Architecture
The backend consists of two main services:
1. **Node API Gateway (Port 3001)**: Handles auth, database persistence, and websocket coordination.
2. **Python AI Engine (Port 8000)**: Handles heavy GPU tasks and AI model inference.

## Prerequisites
- Node.js 20+
- Python 3.10+
- Redis (Optional for local dev, mocked if needed)

## Quick Start

### 1. Start Node API
```bash
cd backend/node-api
pnpm install
npx prisma migrate dev --name init
pnpm dev
```

### 2. Start Python AI
```bash
cd backend/python-ai
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Environment Variables
Ensure `.env` in `backend/node-api` has:
```
DATABASE_URL="file:./dev.db"
PORT=3001
REDIS_HOST=localhost
PYTHON_API_URL=http://localhost:8000
GROQ_API_KEY=your_groq_api_key # Requerido para Magic Prompt
```
