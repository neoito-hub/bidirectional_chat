import { PrismaClient } from '@prisma/client'
import addContact from './seeder/contact_seed.ts'

const prisma = new PrismaClient()

async function main() {
  // addContact(prisma)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })