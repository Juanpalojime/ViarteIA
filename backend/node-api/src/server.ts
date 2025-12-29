// ⚠️ CRITICAL: Load environment variables FIRST, before any other imports
import dotenv from 'dotenv';
dotenv.config();

import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyRedis from '@fastify/redis';
import websocket from '@fastify/websocket';
import fastifyJwt from '@fastify/jwt';
import db from './db';
import { generationRoutes } from './routes/generation';
import { authRoutes } from './routes/auth';
import { assetsRoutes } from './routes/assets';
import { aiRoutes } from './routes/ai';
import { initStorage } from './services/storage';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

// Environment Validation (only critical ones)
const REQUIRED_ENV = ['JWT_SECRET', 'GROQ_API_KEY'];
for (const env of REQUIRED_ENV) {
    if (!process.env[env]) {
        console.error(`❌ Missing critical environment variable: ${env}`);
        console.error(`   Make sure you have a .env file in backend/node-api/ with ${env} defined`);
        process.exit(1);
    }
}

// const prisma = new PrismaClient(); // REMOVED
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
    pluginTimeout: 20000, // Increase timeout for slow plugins (like S3)
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

// Redis connection (Optional for local dev)
if (process.env.REDIS_HOST || process.env.REDIS_PORT) {
    server.register(fastifyRedis, {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379,
        connectTimeout: 5000, // Do not wait forever
    }).ready((err) => {
        if (err) server.log.warn('⚠️ Redis not available. Some features may be limited.');
        else server.log.info('✅ Redis connected');
    });
} else {
    server.log.info('ℹ️ Redis skipped (no config)');
}

// Decorate fastify with db
server.decorate('db', db);

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
    fastify.get('/', async () => {
        return {
            message: 'ViarteIA API is running',
            health: '/api/health',
            docs: '/docs'
        };
    });

    fastify.get('/health', async () => {
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();

        let dbStatus = 'connected';
        try {
            // Simple query to verify SQLite connection
            db.prepare('SELECT 1').get();
        } catch (e) {
            dbStatus = 'error';
        }

        return {
            status: 'ok',
            service: 'node-api',
            uptime: `${Math.floor(uptime)}s`,
            database: dbStatus,
            memory: {
                rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
                heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
            },
            timestamp: new Date().toISOString()
        };
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
        // Initialize services in background to avoid blocking server start (esp. S3 connection)
        initStorage().then(() => {
            console.log('✅ Storage initialized');
        }).catch(storageErr => {
            server.log.warn({ err: storageErr }, '⚠️ Failed to initialize storage. Uploads may not work.');
        });

        const port = Number(process.env.PORT) || 3001;
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`🚀 Server running on port ${port}`);
    } catch (err) {
        server.log.error({ err: err }, 'Failed to start server');
        process.exit(1);
    }
};

start();