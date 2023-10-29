const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function removeDuplicateQuotes() {
  // Fetch all quotes
  const quotes = await prisma.quote.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  })

  // Use a set to keep track of seen dates
  const seenDates = new Set()
  const duplicates = []

  for (let quote of quotes) {
    const createdAt = quote.createdAt.toISOString()
    if (seenDates.has(createdAt)) {
      duplicates.push(quote.id)
    } else {
      seenDates.add(createdAt)
    }
  }

  // Delete duplicates
  for (let id of duplicates) {
    await prisma.quote.delete({
      where: { id: id },
    })
  }

  console.log(`Deleted ${duplicates.length} duplicate quotes.`)

  await prisma.$disconnect()
}

removeDuplicateQuotes().catch(e => {
  console.error(e)
  process.exit(1)
})
