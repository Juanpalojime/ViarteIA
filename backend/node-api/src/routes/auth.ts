import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
});

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function authRoutes(fastify: FastifyInstance) {
    const prisma = (fastify as any).prisma;

    // REGISTER
    fastify.post('/register', async (request, reply) => {
        try {
            const data = RegisterSchema.parse(request.body);

            // Check if user exists
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email },
            });

            if (existingUser) {
                return reply.status(400).send({ error: 'User already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(data.password, 10);

            // Create User
            const user = await prisma.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    name: data.name || data.email.split('@')[0],
                    role: 'user',
                },
            });

            // Generate Data (exclude password)
            const { password, ...userWithoutPassword } = user;

            // Generate Token
            const token = fastify.jwt.sign({ id: user.id, email: user.email, role: user.role });

            return { user: userWithoutPassword, token };

        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: 'Invalid input', details: error.errors });
            }
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Internal Server Error' });
        }
    });

    // LOGIN
    fastify.post('/login', async (request, reply) => {
        try {
            const data = LoginSchema.parse(request.body);

            // Find User
            const user = await prisma.user.findUnique({
                where: { email: data.email },
            });

            if (!user) {
                return reply.status(401).send({ error: 'Invalid credentials' });
            }

            // Verify Password
            const isValid = await bcrypt.compare(data.password, user.password);

            if (!isValid) {
                return reply.status(401).send({ error: 'Invalid credentials' });
            }

            // Generate Token
            const token = fastify.jwt.sign({ id: user.id, email: user.email, role: user.role });

            // Exclude password
            const { password, ...userWithoutPassword } = user;

            return { user: userWithoutPassword, token };

        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: 'Invalid input', details: error.errors });
            }
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Internal Server Error' });
        }
    });

    // GET ME (Protected)
    fastify.get('/me', {
        onRequest: [fastify.authenticate]
    }, async (request, reply) => {
        try {
            const { id } = request.user as any;

            const user = await prisma.user.findUnique({
                where: { id }
            });

            if (!user) return reply.status(404).send({ error: 'User not found' });

            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }
    });
}
