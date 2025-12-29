import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyRedis from '@fastify/redis';
import websocket from '@fastify/websocket';
import fastifyJwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { generationRoutes } from './routes/generation';
import { authRoutes } from './routes/auth';
import { assetsRoutes } from './routes/assets'; // Fixed extra space in path
import { aiRoutes } from './routes/ai';
import { initStorage } from './services/storage';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

dotenv.config();

// Environment Validation
const REQUIRED_ENV = ['JWT_SECRET', 'GROQ_API_KEY', 'S3_ACCESS_KEY', 'S3_SECRET_KEY'];
for (const env of REQUIRED_ENV) {
    if (!process.env[env]) {
        console.error(`❌ Missing critical environment variable: ${env}`);
        process.exit(1);
    }
}

const prisma = new PrismaClient();
const server = Fastify({
    logger: process.env.NODE_ENV === 'production' ? true : {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                ignore: 'pid,hostname'
            }
        }
    },
    maxParamLength: 5000,
    ignoreTrailingSlash: true,
});

// Register plugins
server.register(helmet, {
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
});

server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
});

server.register(cors, {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

server.register(multipart);
server.register(websocket);

server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'supersecret_dev_key_12345'
});

// Redis connection
server.register(fastifyRedis, {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379
});

// Decorate fastify with prisma
server.decorate('prisma', prisma);

// Auth decorator (mejorado)
server.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.status(401).send({
            error: 'Unauthorized',
            message: 'Invalid or missing authentication token'
        });
    }
});

// Register routes
server.register(async (fastify) => {
    // Public Health
    fastify.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });

    // API Routes
    fastify.register(async (api) => {
        api.get('/health/gpu', async () => {
            try {
                const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000';
                const response = await axios.get(`${pythonApiUrl}/health/gpu`);
                return response.data;
            } catch (error) {
                return { cuda_available: false, status: 'offline' };
            }
        });

        api.register(generationRoutes, { prefix: '/generations' });
        api.register(authRoutes, { prefix: '/auth' });
        api.register(assetsRoutes, { prefix: '/assets' });
        api.register(aiRoutes, { prefix: '/ai' });
    }, { prefix: '/api' });

    // WebSocket endpoint
    fastify.get('/ws/progress', { websocket: true }, (connection, _req) => {
        connection.socket.on('message', (message: string) => {
            fastify.log.info(`WS Message: ${message.toString()}`);
        });
    });
});

// ✅ Global Error Handler (TypeScript-safe)
server.setErrorHandler((error, _request, reply) => {
    server.log.error(error);

    if (typeof error === 'object' && error !== null) {
        if ('validation' in error) {
            return reply.status(400).send({
                error: 'Validation Error',
                message: (error as any).message || 'Invalid input'
            });
        }

        const err = error as { statusCode?: number; name?: string; message?: string };
        const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
        const name = typeof err.name === 'string' ? err.name : 'Internal Server Error';
        const message =
            process.env.NODE_ENV === 'production'
                ? 'An unexpected error occurred'
                : (typeof err.message === 'string' ? err.message : 'Unknown error');

        return reply.status(statusCode).send({ error: name, message });
    }

    // Fallback for non-object errors (e.g., string, number)
    return reply.status(500).send({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : 'Unknown error type'
    });
});

// Start server
const start = async () => {
    try {
        // Initialize services with error handling
        try {
            await initStorage();
            console.log('✅ Storage initialized');
        } catch (storageErr) {
            server.log.error({ err: storageErr }, 'Failed to initialize storage');
            process.exit(1);
        }

        const port = Number(process.env.PORT) || 3001;
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`🚀 Server running on port ${port}`);
    } catch (err) {
        server.log.error({ err: err }, 'Failed to start server');
        process.exit(1);
    }
};

start();