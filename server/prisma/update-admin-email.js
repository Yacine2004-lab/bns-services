import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function updateAdminEmail() {
  try {
    // Update the existing admin email
    const result = await prisma.adminUser.updateMany({
      where: { email: 'admin@bnsservices.sn' },
      data: { email: 'contact@bayeniassservices.com' },
    })
    console.log('Updated:', result.count, 'admin record(s)')
    
    // Verify
    const admin = await prisma.adminUser.findUnique({
      where: { email: 'contact@bayeniassservices.com' },
      select: { email: true, name: true },
    })
    console.log('Admin email now:', admin?.email)
    console.log('Admin name:', admin?.name)
  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    await prisma.$disconnect()
  }
}

updateAdminEmail()
