# 🚀 ViarteIA - Guía de Ejecución en Colab (GPU T4)

Esta guía te permitirá ejecutar todo el sistema (Frontend, Node API y Python AI) en una sola instancia de Google Colab.

## 1. Configuración de Entorno
Asegúrate de que tu entorno en Colab tenga **GPU activa** (T4).

## 2. Instalación Rápida
Ejecuta estas celdas en tu notebook de Colab:

```python
# 1. Clonar el repositorio y entrar
!git clone https://github.com/tu-usuario/ViarteIA.git
%cd ViarteIA

# 2. Instalar dependencias globales
!npm install -g pnpm
!pnpm install

# 3. Configurar variables de entorno
import os
os.environ["NGROK_AUTH_TOKEN"] = "TU_TOKEN_DE_NGROK"
os.environ["GROQ_API_KEY"] = "TU_TOKEN_DE_GROQ" # Requerido para Magic Prompt
os.environ["S3_ENDPOINT"] = "http://localhost:9000" # O tu endpoint real
os.environ["NGROK_ENABLED"] = "true"
```

## 3. Ejecutar el Sistema Completo
He preparado un script maestro que inicia todos los servicios:

```python
!python master_launcher.py
```

## 4. Acceder al Frontend
El script te proporcionará una URL de **Ngrok** para el Frontend y otra para el Backend. Usa la del Frontend para empezar a generar.

---

### Notas Técnicas:
- **Modelos**: El sistema descargará automáticamente `CogVideoX-2b` (~10GB) y `SVD-XT` la primera vez.
- **Memoria**: Se han habilitado optimizaciones de `CPU Offload` y `FP16` para que todo quepa en la VRAM de la T4.
- **Persistencia**: Se recomienda conectar Google Drive si deseas guardar los modelos descargados y no volver a bajarlos cada vez.
