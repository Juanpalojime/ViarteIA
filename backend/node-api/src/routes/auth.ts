import { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

// ✅ Tipado explícito del usuario en la sesión JWT
declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: {
            id: string;
            email: string;
            role: string;
        };
    }
}

// ✅ Esquemas con validación más segura
const RegisterSchema = z.object({
    email: z.string().email({ message: 'Email inválido' }),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'La contraseña debe incluir una mayúscula')
        .regex(/[0-9]/, 'La contraseña debe incluir un número'),
    name: z.string().min(1).max(50).optional(),
});

const LoginSchema = z.object({
    email: z.string().email({ message: 'Email inválido' }),
    password: z.string().min(1, 'La contraseña es requerida'),
});

// ✅ Helper para eliminar la contraseña de forma segura
const excludePassword = <T extends { password: string }>(user: T): Omit<T, 'password'> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export async function authRoutes(fastify: FastifyInstance) {
    // ✅ Acceso a DB (SQLite)
    const db = (fastify as any).db;

    // REGISTER
    fastify.post('/register', async (request, reply) => {
        try {
            const { email, password, name } = RegisterSchema.parse(request.body);

            // Verificar si el usuario ya existe
            const existingUser = db.prepare('SELECT * FROM User WHERE email = ?').get(email);
            if (existingUser) {
                // ✅ Mensaje genérico para evitar enumeración de usuarios
                return reply.status(400).send({ error: 'Credenciales inválidas' });
            }

            // Hashear contraseña
            const hashedPassword = await bcrypt.hash(password, 12); // ✅ 12 rondas para mayor seguridad

            // Crear usuario
            const userId = randomUUID();
            const role = 'user';
            const userName = name || email.split('@')[0];

            db.prepare(`
                INSERT INTO User (id, email, password, name, role)
                VALUES (?, ?, ?, ?, ?)
            `).run(userId, email, hashedPassword, userName, role);

            const user = db.prepare('SELECT * FROM User WHERE id = ?').get(userId);

            // Generar token JWT
            const token = fastify.jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role,
            });

            return {
                user: excludePassword(user),
                token,
            };
        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({
                    error: 'Datos inválidos',
                    details: error.errors.map(e => ({
                        field: e.path.join('.'),
                        message: e.message,
                    })),
                });
            }
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Error interno del servidor' });
        }
    });

    // LOGIN
    fastify.post('/login', async (request, reply) => {
        try {
            const { email, password } = LoginSchema.parse(request.body);

            const user = db.prepare('SELECT * FROM User WHERE email = ?').get(email);
            if (!user) {
                // ✅ Mismo mensaje que para contraseña incorrecta (evita enumeración)
                return reply.status(401).send({ error: 'Credenciales inválidas' });
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return reply.status(401).send({ error: 'Credenciales inválidas' });
            }

            const token = fastify.jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role,
            });

            return {
                user: excludePassword(user),
                token,
            };
        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({
                    error: 'Datos inválidos',
                    details: error.errors.map(e => ({
                        field: e.path.join('.'),
                        message: e.message,
                    })),
                });
            }
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Error interno del servidor' });
        }
    });

    // GET ME (Protegido)
    fastify.get('/me', { onRequest: [fastify.authenticate] }, async (request, reply) => {
        try {
            const { id } = request.user;

            const user = db.prepare('SELECT * FROM User WHERE id = ?').get(id);
            if (!user) {
                return reply.status(404).send({ error: 'Usuario no encontrado' });
            }

            return excludePassword(user);
        } catch (error) {
            fastify.log.error(error);
            return reply.status(401).send({ error: 'No autorizado' });
        }
    });
}