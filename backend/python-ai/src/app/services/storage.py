import boto3
import os
from botocore.exceptions import NoCredentialsError

# Configuración desde variables de entorno
S3_ENDPOINT = os.getenv("S3_ENDPOINT", "http://127.0.0.1:9000")
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY", "admin")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY", "adminpassword")
S3_BUCKET = os.getenv("S3_BUCKET", "viarteia-assets")
S3_REGION = os.getenv("S3_REGION", "us-east-1")

s3_client = boto3.client(
    's3',
    endpoint_url=S3_ENDPOINT,
    aws_access_key_id=S3_ACCESS_KEY,
    aws_secret_access_key=S3_SECRET_KEY,
    region_name=S3_REGION
)

def upload_file(file_path, object_name=None):
    """Sube un archivo a S3 y devuelve la URL pública/accesible"""
    if object_name is None:
        object_name = os.path.basename(file_path)

    try:
        s3_client.upload_file(file_path, S3_BUCKET, object_name) #, ExtraArgs={'ACL': 'public-read'})
        
        # Generar URL (Asumiendo bucket público o estructura simple)
        # Si es MinIO local:
        return f"{S3_ENDPOINT}/{S3_BUCKET}/{object_name}"
    except FileNotFoundError:
        print("The file was not found")
        return None
    except NoCredentialsError:
        print("Credentials not available")
        return None
