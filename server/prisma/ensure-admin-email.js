import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function ensureAdminEmail() {
  const NEW_EMAIL = 'contact@bayeniassservices.com'
  const PASSWORD = 'bayeniass@26'
  const bcrypt = await import('bcryptjs')
  const hash = await bcrypt.default.hash(PASSWORD, 10)
  
  try {
    await prisma.adminUser.upsert({
      where: { email: NEW_EMAIL },
      update: { password: hash, name: 'Super Admin BNS', role: 'admin' },
      create: { email: NEW_EMAIL, name: 'Super Admin BNS', password: hash, role: 'admin' },
    })
    console.log('Admin credentials synchronized:', NEW_EMAIL)
  } catch (err) {
    console.error('Error ensuring admin email:', err.message)
  } finally {
    await prisma.$disconnect()
  }
}

ensureAdminEmail()
