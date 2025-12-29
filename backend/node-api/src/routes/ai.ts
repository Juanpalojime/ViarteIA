import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import Groq from 'groq-sdk';

const MagicPromptSchema = z.object({
    userIdea: z.string().min(1),
});

const ChatSchema = z.object({
    message: z.string().min(1),
    history: z.array(z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string()
    })).optional(),
});

export async function aiRoutes(fastify: FastifyInstance) {
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY || '***REMOVED_GROQ_API_KEY***'
    });

    // MAGIC PROMPT
    fastify.post('/magic-prompt', async (request, reply) => {
        try {
            const { userIdea } = MagicPromptSchema.parse(request.body);

            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'Eres un asistente creativo experto en generar prompts detallados y vívidos para generación de video. Usa lenguaje visual, emocional y técnico. Responde directamente con el prompt optimizado, sin introducciones.'
                    },
                    {
                        role: 'user',
                        content: `Genera un prompt mágico detallado para un video basado en: ${userIdea}`
                    }
                ],
                model: 'llama3-8b-8192',
                max_tokens: 500,
                temperature: 0.8,
            });

            return { magic_prompt: chatCompletion.choices[0].message.content };
        } catch (error: any) {
            fastify.log.error(error);
            return reply.status(500).send({ error: error.message });
        }
    });

    // AI ASSISTANT CHAT
    fastify.post('/assistant', async (request, reply) => {
        try {
            const { message, history } = ChatSchema.parse(request.body);

            const messages: any[] = [
                {
                    role: 'system',
                    content: 'Eres el Asistente AI de ViarteIA. Ayudas a los usuarios a crear videos increíbles, sugerir estilos, explicar parámetros técnicos y mejorar sus ideas creativas. Sé amable, profesional y conciso.'
                },
                ...(history || []),
                {
                    role: 'user',
                    content: message
                }
            ];

            const chatCompletion = await groq.chat.completions.create({
                messages,
                model: 'llama3-8b-8192',
                max_tokens: 1000,
                temperature: 0.7,
            });

            return { response: chatCompletion.choices[0].message.content };
        } catch (error: any) {
            fastify.log.error(error);
            return reply.status(500).send({ error: error.message });
        }
    });
}
