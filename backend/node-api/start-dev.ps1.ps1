# start-dev.ps1
# Script para iniciar todos los servicios de ViarteIA en desarrollo
# Requisitos: Docker y Node.js instalados

Write-Host "🎬 Iniciando servicios de ViarteIA..." -ForegroundColor Cyan

# Directorio del proyecto
$ProjectRoot = "$PSScriptRoot"
$NodeApiDir = "$ProjectRoot\backend\node-api"
$PythonAiDir = "$ProjectRoot\backend\python-ai"

# === 1. Levantar PostgreSQL ===
Write-Host "`n🐘 Iniciando PostgreSQL..." -ForegroundColor Green
docker run -d `
  --name viarteia-postgres `
  -e POSTGRES_DB=viarteia `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -p 5432:5432 `
  -v viarteia-postgres-data:/var/lib/postgresql/data `
  postgres:15

# === 2. Levantar MinIO ===
Write-Host "`n🪣 Iniciando MinIO..." -ForegroundColor Green
docker run -d `
  --name viarteia-minio `
  -p 9000:9000 `
  -p 9001:9001 `
  -e MINIO_ROOT_USER=minioadmin `
  -e MINIO_ROOT_PASSWORD=minioadmin `
  -v viarteia-minio-/data `
  minio/minio server /data --console-address ":9001"

# === 3. Crear .env para Node.js (si no existe) ===
$EnvPath = "$NodeApiDir\.env"
if (-not (Test-Path $EnvPath)) {
    Write-Host "`n🔐 Creando archivo .env..." -ForegroundColor Yellow
    $EnvContent = @"
GROQ_API_KEY=tu_clave_de_groq_aqui
JWT_SECRET=$( -join ((65..90) + (97..122) + (48..57) + (33,35,37,38,42,43,61,64,95) | Get-Random -Count 64 | % {[char]$_}) )
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/viarteia
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=viarteia-assets
REDIS_HOST=localhost
REDIS_PORT=6379
PYTHON_API_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
PORT=3001
"@
    Set-Content -Path $EnvPath -Value $EnvContent
    Write-Host "⚠️  ¡Edita .env y reemplaza 'tu_clave_de_groq_aqui' por tu clave real!" -ForegroundColor Red
}

# === 4. Instalar dependencias y levantar Node.js API ===
Write-Host "`n🚀 Iniciando Backend Node.js..." -ForegroundColor Green
Set-Location $NodeApiDir

# Usar pnpm si está disponible, si no, usar npm
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm install
    Start-Process -FilePath "pnpm" -ArgumentList "run dev" -PassThru
} else {
    npm install
    Start-Process -FilePath "npm" -ArgumentList "run dev" -PassThru
}

# === 5. Levantar Motor de IA (mock si no existe python-ai) ===
if (Test-Path "$PythonAiDir\main.py") {
    Write-Host "`n🧠 Iniciando Motor de IA (Python)..." -ForegroundColor Green
    Set-Location $PythonAiDir
    Start-Process -FilePath "python" -ArgumentList "main.py" -PassThru
} else {
    Write-Host "`n🧪 Iniciando Mock de Motor de IA..." -ForegroundColor Magenta
    $MockCode = @'
from flask import Flask, jsonify
app = Flask(__name__)
@app.route('/health/gpu')
def gpu():
    return jsonify({"cuda_available": False, "status": "mocked"})
if __name__ == '__main__':
    app.run(port=8000)
'@
    Set-Content -Path "$ProjectRoot\mock-ai.py" -Value $MockCode
    Start-Process -FilePath "python" -ArgumentList "$ProjectRoot\mock-ai.py" -PassThru
}

# === Mensaje final ===
Write-Host "`n✅ Servicios iniciados:" -ForegroundColor Cyan
Write-Host "  - PostgreSQL: localhost:5432" -ForegroundColor Gray
Write-Host "  - MinIO UI: http://localhost:9001 (usuario: minioadmin / pass: minioadmin)" -ForegroundColor Gray
Write-Host "  - Backend: http://localhost:3001/api/health" -ForegroundColor Gray
Write-Host "  - Motor IA: http://localhost:8000/health/gpu" -ForegroundColor Gray
Write-Host "`n⚠️  ¡No olvides editar $EnvPath con tu GROQ_API_KEY real!" -ForegroundColor Red

Set-Location $ProjectRoot