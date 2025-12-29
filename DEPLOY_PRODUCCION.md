# 🏗️ Guía de Despliegue en Producción - ViarteIA

Esta guía detalla los pasos para desplegar la plataforma en un servidor con GPU (Cloud o On-premise).

## 🖥️ Requisitos del Servidor
- **OS:** Ubuntu 22.04 LTS (Recomendado).
- **GPU:** NVIDIA (RTX 3090/4090, T4, A10, A100) con al menos 16GB de VRAM.
- **Drivers:** NVIDIA Driver 535+.
- **Herramientas:** Docker + Docker Compose + [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html).

## 🛠️ Configuración del Entorno

### 1. Preparar la GPU en Docker
Es imperativo que Docker pueda acceder a la GPU. Instala el toolkit oficial de NVIDIA:
```bash
# Configurar repositorio y GPG key
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
# ... (sigue instrucciones oficiales según tu distro)
sudo apt-get install -y nvidia-container-toolkit

# Reiniciar Docker
sudo systemctl restart docker
```

### 2. Variables de Entorno de Producción
Crea archivos `.env` reales para cada servicio siguiendo los ejemplos proporcionados en la raíz del proyecto. **No uses las claves de desarrollo en producción.**

### 3. Gestión de Modelos IA
El motor descarga automáticamente los modelos de HuggingFace. Para evitar latencia y consumo de red en escalado:
- El volumen `ai-models` en `docker-compose.yml` persistirá los modelos en el host.
- Puedes precargar los modelos copiándolos a la carpeta mapeada del host antes de arrancar.

## 🚀 Despliegue con Docker Compose
Desde la raíz del proyecto:
```bash
docker-compose -f infra/docker/docker-compose.yml up -d --build
```

## 📈 Escalabilidad y Optimizaciones
- **Redis:** La instancia de Redis incluida es básica. Para producción masiva, considera usar un Redis gestionado.
- **S3:** MinIO es excelente para pruebas y On-premise. Para escala global, simplemente cambia las variables `S3_ENDPOINT` por las de AWS S3 o Cloudflare R2.
- **Worker Scaling:** Si la demanda de videos aumenta, puedes desplegar múltiples instancias del contenedor `python-ai` en diferentes máquinas con GPU y balancearlas con un Queue Manager (Celery/BullMQ).

## 🛡️ Seguridad
1. **Firewall:** Solo expón los puertos necesarios (p.ej. 80/443 vía un Proxy Inverso como Nginx/Traefik).
2. **Secrets:** Cambia `JWT_SECRET` y las contraseñas de Base de Datos y MinIO.
3. **CORS:** En `server.ts`, restringe `origin` a tus dominios reales en lugar de `*`.
