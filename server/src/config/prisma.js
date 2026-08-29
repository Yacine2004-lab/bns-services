import { PrismaClient } from '@prisma/client'

// Instance unique de Prisma Client pour toute l'application
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})
