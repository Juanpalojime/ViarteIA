import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getUploadUrl } from '../services/storage';
import { randomUUID } from 'crypto';
import path from 'path';

const UploadRequestSchema = z.object({
    filename: z.string(),
    contentType: z.string(),
});

export async function assetsRoutes(fastify: FastifyInstance) {
    // GET PRESIGNED URL
    fastify.post('/upload-url', {
        onRequest: [fastify.authenticate]
    }, async (request, reply) => {
        try {
            const { filename, contentType } = UploadRequestSchema.parse(request.body);
            const user = request.user as any;

            const ext = path.extname(filename);
            const key = `uploads/${user.id}/${randomUUID()}${ext}`;

            const uploadUrl = await getUploadUrl(key, contentType);

            // En S3/MinIO, la URL pública depende de la configuración. 
            // Para desarrollo devolvemos la key que puede ser usada para generar una downloadUrl luego,
            // o construimos la URL pública si el bucket es público.
            const publicUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`;

            return {
                uploadUrl,
                key,
                url: publicUrl // URL tentativa para acceso directo si es público
            };

        } catch (error) {
            fastify.log.error(error);
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: 'Invalid input' });
            }
            return reply.status(500).send({ error: 'Internal Server Error' });
        }
    });
}
