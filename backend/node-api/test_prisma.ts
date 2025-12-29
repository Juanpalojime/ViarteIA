import { PrismaClient } from '@prisma/client';
console.log('--- ISOLATED PRISMA TEST ---');
try {
    const prisma = new PrismaClient();
    console.log('PrismaClient created successfully');
} catch (e) {
    console.error('Error creating PrismaClient:', e);
}
