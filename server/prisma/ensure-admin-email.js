import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function ensureAdminEmail() {
  const NEW_EMAIL = 'contact@bayeniassservices.com'
  const OLD_EMAIL = 'admin@bnsservices.sn'
  const PASSWORD = 'admin1234'
  
  try {
    // Check if admin exists with new email
    const existingNew = await prisma.adminUser.findUnique({
      where: { email: NEW_EMAIL },
      select: { id: true, email: true, name: true },
    })
    
    if (existingNew) {
      console.log('Admin already has correct email:', existingNew.email)
      return
    }
    
    // Check if admin exists with old email
    const existingOld = await prisma.adminUser.findUnique({
      where: { email: OLD_EMAIL },
      select: { id: true, email: true },
    })
    
    if (existingOld) {
      await prisma.adminUser.update({
        where: { email: OLD_EMAIL },
        data: { email: NEW_EMAIL },
      })
      console.log('Updated admin email from', OLD_EMAIL, 'to', NEW_EMAIL)
      return
    }
    
    // No admin found at all - create one
    const bcrypt = await import('bcryptjs')
    const hash = await bcrypt.default.hash(PASSWORD, 10)
    await prisma.adminUser.create({
      data: {
        email: NEW_EMAIL,
        name: 'Super Admin BNS',
        password: hash,
        role: 'admin',
      },
    })
    console.log('Created new admin with email:', NEW_EMAIL)
  } catch (err) {
    console.error('Error ensuring admin email:', err.message)
  } finally {
    await prisma.$disconnect()
  }
}

ensureAdminEmail()
