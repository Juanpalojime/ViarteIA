import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import axios from 'axios';
import { randomUUID } from 'crypto';

// Schema validation
const GenerationRequestSchema = z.object({
    type: z.enum(['text-to-video', 'image-to-video']),
    prompt: z.string().min(1),
    negativePrompt: z.string().optional(),
    imageUrl: z.string().optional(),
    faceImageUrl: z.string().optional(),
    settings: z.object({
        aspectRatio: z.string().optional(),
        duration: z.number().optional(),
        fps: z.number().optional(),
        upscale: z.boolean().optional(),
    }).optional(),
});

export async function generationRoutes(fastify: FastifyInstance) {
    const db = (fastify as any).db;

    // Create Generation
    fastify.post('/', {
        onRequest: [fastify.authenticate]
    }, async (request, reply) => {
        try {
            // 1. Validate Input
            const body = GenerationRequestSchema.parse(request.body);
            const user = (request as any).user;

            // 2. Create DB Record linked to user
            const generationId = randomUUID();
            const settingsJson = JSON.stringify(body.settings || {});

            db.prepare(`
                INSERT INTO Generation (id, userId, type, prompt, negativePrompt, settings, status, progress)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
                generationId,
                user.id,
                body.type,
                body.prompt,
                body.negativePrompt || null,
                settingsJson,
                'pending',
                0
            );

            const generation = db.prepare('SELECT * FROM Generation WHERE id = ?').get(generationId);

            // 3. Trigger AI Service (Python)
            const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000';

            try {
                const payload: any = {
                    id: generation.id,
                    prompt: body.prompt,
                    negative_prompt: body.negativePrompt,
                    ...body.settings
                };

                if (body.type === 'image-to-video') {
                    payload.imageUrl = body.imageUrl;
                }

                if (body.faceImageUrl) {
                    payload.faceImageUrl = body.faceImageUrl;
                }

                logger.info(`Forwarding generation request ${generation.id} to Python AI at ${pythonApiUrl}`);

                // Fire and forget, Python AI will update via webhook
                axios.post(`${pythonApiUrl}/generate/${body.type === 'text-to-video' ? 'text' : 'image'}`, payload)
                    .catch(err => fastify.log.error(`AI Service Async Error: ${err.message}`));

                // Update status to processing
                db.prepare('UPDATE Generation SET status = ? WHERE id = ?').run('processing', generation.id);
                const updated = db.prepare('SELECT * FROM Generation WHERE id = ?').get(generation.id);

                return reply.send(updated);

            } catch (aiError: any) {
                fastify.log.error(`AI Service immediate failure: ${aiError.message}`);

                db.prepare('UPDATE Generation SET status = ?, error = ? WHERE id = ?')
                    .run('failed', 'AI Service Communication Error', generation.id);

                return reply.status(503).send({ error: 'AI Service Unavailable' });
            }

        } catch (error: any) {
            fastify.log.error(error);
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: 'Invalid input', details: error.errors });
            }
            return reply.status(500).send({ error: 'Internal Server Error' });
        }
    });

    // Get User Generations
    fastify.get('/', {
        onRequest: [fastify.authenticate]
    }, async (request, reply) => {
        const user = (request as any).user;
        const generations = db.prepare(`
            SELECT * FROM Generation 
            WHERE userId = ? 
            ORDER BY createdAt DESC 
            LIMIT 50
        `).all(user.id);

        return reply.send(generations);
    });

    // Webhook for Python AI to update status
    fastify.post('/webhook/update', async (request, reply) => {
        const body = request.body as any;
        const { id, status, progress, resultUrl, error } = body;

        if (!id) return reply.status(400).send({ error: 'Missing ID' });

        const updateData: any = { status, progress };
        if (resultUrl) updateData.resultUrl = resultUrl;
        if (error) updateData.error = error;
        if (status === 'completed') updateData.progress = 100;

        try {
            // Dynamic Update
            const keys = Object.keys(updateData);
            if (keys.length > 0) {
                const setClause = keys.map(k => `${k} = ?`).join(', ');
                const values = keys.map(k => updateData[k]);

                db.prepare(`UPDATE Generation SET ${setClause} WHERE id = ?`).run(...values, id);
            }

            const generation = db.prepare('SELECT * FROM Generation WHERE id = ?').get(id);

            // Notify WebSocket clients
            fastify.websocketServer.clients.forEach((client: any) => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({
                        type: 'generation_update',
                        data: generation
                    }));
                }
            });

            return reply.send({ success: true });
        } catch (dbError: any) {
            fastify.log.error(`Webhook DB Error: ${dbError.message}`);
            return reply.status(500).send({ error: 'Database update failed' });
        }
    });
}

// Simple logger helper since fastify.log is used
const logger = {
    info: (msg: string) => console.log(`[INFO] ${msg}`),
    error: (msg: string) => console.error(`[ERROR] ${msg}`)
};
