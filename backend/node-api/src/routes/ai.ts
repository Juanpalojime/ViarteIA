import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import Groq from 'groq-sdk';

// 🔴 ¡CRÍTICO! Valida la API key al cargar el módulo
if (!process.env.GROQ_API_KEY) {
    throw new Error(
        '❌ FATAL: GROQ_API_KEY no está definida. Asegúrate de configurarla en tu entorno.'
    );
}

// 🟢 Cliente Groq reutilizable (solo una instancia)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// 🟢 Tipos seguros para mensajes
type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

// 🔒 Esquemas con límites anti-abuso
const MagicPromptSchema = z.object({
    userIdea: z
        .string()
        .min(1, 'La idea no puede estar vacía')
        .max(500, 'La idea no debe exceder los 500 caracteres'),
});

const ChatSchema = z.object({
    message: z
        .string()
        .min(1, 'El mensaje no puede estar vacío')
        .max(1000, 'El mensaje no debe exceder los 1000 caracteres'),
    history: z
        .array(
            z.object({
                role: z.enum(['user', 'assistant', 'system']),
                content: z.string().min(1).max(2000, 'Los mensajes del historial son demasiado largos'),
            })
        )
        .max(20, 'El historial no puede tener más de 20 mensajes')
        .optional(),
});

export async function aiRoutes(fastify: FastifyInstance) {
    // MAGIC PROMPT
    fastify.post('/magic-prompt', async (request, reply) => {
        try {
            const { userIdea } = MagicPromptSchema.parse(request.body);

            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content:
                            'Eres un asistente creativo experto en generar prompts detallados y vívidos para generación de video. ' +
                            'Usa lenguaje visual, emocional y técnico. Responde directamente con el prompt optimizado, sin introducciones ni comillas.',
                    },
                    { role: 'user', content: `Genera un prompt mágico detallado para un video basado en: ${userIdea}` },
                ],
                model: 'llama3-8b-8192',
                max_tokens: 500,
                temperature: 0.8,
            }, { timeout: 30_000 });

            const magicPrompt = chatCompletion.choices[0]?.message?.content?.trim() || '';
            if (!magicPrompt) {
                return reply.status(502).send({ error: 'No se pudo generar el prompt. Inténtalo de nuevo.' });
            }

            return { magic_prompt: magicPrompt };
        } catch (error: any) {
            fastify.log.error({ err: error, route: 'magic-prompt' }, 'Error en Groq (magic-prompt)');

            // 🎯 Respuestas específicas para el frontend
            if (error?.status === 429) {
                return reply.status(429).send({ error: 'Demasiadas solicitudes. Espera un momento.' });
            }
            if (error?.status === 401) {
                return reply.status(500).send({ error: 'Error interno: servicio de IA no disponible.' });
            }

            return reply.status(500).send({ error: 'No se pudo generar el prompt. Inténtalo más tarde.' });
        }
    });

    // AI ASSISTANT CHAT
    fastify.post('/assistant', async (request, reply) => {
        try {
            const { message, history = [] } = ChatSchema.parse(request.body);

            const messages: ChatMessage[] = [
                {
                    role: 'system',
                    content:
                        'Eres el Asistente AI de ViarteIA. Ayudas a los usuarios a crear videos increíbles, ' +
                        'sugerir estilos, explicar parámetros técnicos y mejorar sus ideas creativas. ' +
                        'Sé amable, profesional, conciso y enfocado en generación de video.',
                },
                ...history,
                { role: 'user', content: message },
            ];

            const chatCompletion = await groq.chat.completions.create({
                messages,
                model: 'llama3-8b-8192',
                max_tokens: 1000,
                temperature: 0.7,
            }, { timeout: 45_000 });

            const response = chatCompletion.choices[0]?.message?.content?.trim() || '';
            if (!response) {
                return reply.status(502).send({ error: 'El asistente no respondió. Inténtalo de nuevo.' });
            }

            return { response };
        } catch (error: any) {
            fastify.log.error({ err: error, route: 'assistant' }, 'Error en Groq (assistant)');

            if (error?.status === 429) {
                return reply.status(429).send({ error: 'Demasiadas solicitudes. Espera un momento.' });
            }
            if (error?.status === 401) {
                return reply.status(500).send({ error: 'Error interno: servicio de IA no disponible.' });
            }

            return reply.status(500).send({ error: 'El asistente no está disponible. Inténtalo más tarde.' });
        }
    });
}