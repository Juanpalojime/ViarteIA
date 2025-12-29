# 🚀 ViarteIA - Guía de Inicio Rápido

## 📋 Prerrequisitos

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0
- **Python** >= 3.11
- **Docker** (opcional, para desarrollo con contenedores)
- **CUDA** >= 12.1 (opcional, para GPU acceleration)

---

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/viarteia.git
cd viarteia
```

### 2. Instalar dependencias

```bash
# Instalar pnpm si no lo tienes
npm install -g pnpm

# Instalar todas las dependencias del monorepo
pnpm install
```

### 3. Configurar variables de entorno

**Frontend:**
```bash
cd apps/web
cp .env.example .env
```

**Node API:**
```bash
cd backend/node-api
cp .env.example .env
```

**Python AI:**
```bash
cd backend/python-ai
cp .env.example .env
```

---

## 🏃 Desarrollo Local

### Opción 1: Ejecutar todo con Turbo (Recomendado)

```bash
# Desde la raíz del proyecto
pnpm dev
```

Esto iniciará:
- ✅ Frontend en `http://localhost:3000`
- ✅ Node API en `http://localhost:3001`
- ⚠️ Python AI requiere inicio manual (ver abajo)

### Opción 2: Ejecutar servicios individualmente

**Terminal 1 - Frontend:**
```bash
pnpm web
# o
cd apps/web && pnpm dev
```

**Terminal 2 - Node API:**
```bash
pnpm api
# o
cd backend/node-api && pnpm dev
```

**Terminal 3 - Python AI:**
```bash
# Crear virtual environment
cd backend/python-ai
python -m venv venv

# Activar venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 4 - Redis:**
```bash
# Con Docker
docker run -p 6379:6379 redis:7-alpine

# O instalar Redis localmente
```

---

## 🐳 Desarrollo con Docker

```bash
cd infra/docker
docker-compose up
```

Servicios disponibles:
- Frontend: `http://localhost:3000`
- Node API: `http://localhost:3001`
- Python AI: `http://localhost:8000`
- Redis: `localhost:6379`
- MinIO: `http://localhost:9000` (console: `http://localhost:9001`)

---

## 🧪 Testing

```bash
# Ejecutar todos los tests
pnpm test

# Solo frontend
cd apps/web && pnpm test

# Solo backend
cd backend/node-api && pnpm test
```

---

## 📦 Build para Producción

```bash
# Build todo
pnpm build

# Solo frontend
cd apps/web && pnpm build

# Solo Node API
cd backend/node-api && pnpm build
```

---

## 🔍 Verificar Instalación

### Frontend:
```bash
curl http://localhost:3000
# Debe retornar HTML de la app
```

### Node API:
```bash
curl http://localhost:3001/health
# Debe retornar: {"status":"ok","timestamp":"..."}
```

### Python AI:
```bash
curl http://localhost:8000/health
# Debe retornar: {"status":"ok","service":"viarteia-python-ai"}

curl http://localhost:8000/health/gpu
# Debe retornar info de GPU (si está disponible)
```

---

## 🎯 Próximos Pasos

1. **Explorar la UI:** Abre `http://localhost:3000`
2. **IA Creativa:** Usa el "Magic Prompt" potenciado por Groq (Llama 3 70B).
3. **Probar generación:** Usa la página de generación de video con modelos open-source.
4. **Revisar logs:** Observa los logs en cada terminal

---

## 🐛 Troubleshooting

### Error: "pnpm not found"
```bash
npm install -g pnpm
```

### Error: "CUDA not available"
- Verifica que tienes drivers NVIDIA instalados
- Verifica que CUDA Toolkit está instalado
- Ejecuta: `nvidia-smi` para verificar

### Error: "Redis connection failed"
```bash
# Iniciar Redis con Docker
docker run -p 6379:6379 redis:7-alpine
```

### Error: "Port already in use"
```bash
# Cambiar puerto en .env
# Frontend: VITE_PORT=3001
# Node API: PORT=3002
# Python AI: uvicorn app.main:app --port 8001
```

---

## 📚 Recursos

- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de Fastify](https://fastify.dev/)
- [Documentación de FastAPI](https://fastapi.tiangolo.com/)
- [Documentación de Zustand](https://zustand-demo.pmnd.rs/)
- [Documentación de vanilla-extract](https://vanilla-extract.style/)

---

**¿Necesitas ayuda?** Abre un issue en GitHub o contacta al equipo.
