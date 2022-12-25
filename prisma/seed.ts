import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)
  const authorAndBook = await prisma.book.create({
    data: {
      title: 'John Doe\'s Book',
      author: {
        create: {
          name: 'John Doe'
        },
      },
    },
  })
  await prisma.quote.create({
    data: {
      createdAt: new Date(),
      sourceId: authorAndBook.id,
      content: 'Hello world',
      line: "100",
      page: "20"
    }
  })
  console.log(`Seeding finished.`)
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
