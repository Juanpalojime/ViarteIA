import os
import subprocess
import time
import threading
import sys

def setup_ngrok():
    try:
        from pyngrok import ngrok
    except ImportError:
        print("Installing pyngrok...")
        subprocess.run([sys.executable, "-m", "pip", "install", "pyngrok"])
        from pyngrok import ngrok

    auth_token = os.getenv("NGROK_AUTH_TOKEN")
    if not auth_token:
        print("⚠️ Warning: NGROK_AUTH_TOKEN not found. Ngrok tunnels will not be created.")
        return "http://localhost:3001", "http://localhost:3000"
    
    ngrok.set_auth_token(auth_token)
    
    # Tunnel for Node API (Port 3001)
    api_tunnel = ngrok.connect(3001)
    print(f"🚀 Node API Public URL: {api_tunnel.public_url}")
    
    # Tunnel for Web Frontend (Port 3000)
    web_tunnel = ngrok.connect(3000)
    print(f"🚀 Web Frontend Public URL: {web_tunnel.public_url}")
    
    return api_tunnel.public_url, web_tunnel.public_url

def run_service(name, cmd, cwd, env=None):
    print(f"🔄 Starting {name} in {cwd}...")
    my_env = os.environ.copy()
    if env:
        my_env.update(env)
    
    subprocess.run(cmd, cwd=cwd, env=my_env, shell=True)

if __name__ == "__main__":
    print("🌟 ViarteIA - Master Launcher 🌟")
    
    # Setup Ngrok
    api_public_url, web_public_url = setup_ngrok()
    
    root_dir = os.getcwd()

    # ENV Variables
    node_env = {
        "PORT": "3001",
        "PYTHON_API_URL": "http://localhost:8000",
        "DATABASE_URL": "file:./dev.db",
        "JWT_SECRET": "professional_secret_key_change_me",
    }
    
    web_env = {
        "VITE_API_URL": f"{api_public_url}/api",
        "VITE_WS_URL": f"{api_public_url.replace('http', 'ws')}/ws/progress"
    }

    # Commands
    node_cmd = "pnpm install && npx prisma db push && npm run dev"
    python_cmd = "pip install -r requirements.txt && uvicorn src.app.main:app --host 0.0.0.0 --port 8000"
    web_cmd = "pnpm install && npm run dev -- --port 3000 --host"

    # Threads
    threads = [
        threading.Thread(target=run_service, args=("Node API", node_cmd, "backend/node-api", node_env)),
        threading.Thread(target=run_service, args=("Python AI", python_cmd, "backend/python-ai")),
        threading.Thread(target=run_service, args=("Web Frontend", web_cmd, "apps/web", web_env)),
    ]

    for t in threads:
        t.start()
        time.sleep(2) # Stagger start

    for t in threads:
        t.join()
