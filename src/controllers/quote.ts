import express from 'express'
import { Prisma, PrismaClient, Tag } from '@prisma/client';

const prisma = new PrismaClient()

/* Create Quotes Router */
const QuoteRouter = express.Router()

// Quotes
const formatQuoteInput = (body: any): Prisma.QuoteCreateInput => {
  const { source, content, quotee, createdAt, meta, user, tags } = body

  const quoteInput: Prisma.QuoteCreateInput = {
    createdAt: createdAt ? new Date(createdAt) : new Date(),
    source: source ? {
      connect: {
        id: source.id
      }
    } : undefined,
    user: {
      connect: {
        id: user.id
      }
    },
    tags: {
      connectOrCreate: tags?.map((tag: Tag) => ({
        where: { name: tag.name },
        create: { name: tag.name }
      }))
    },
    content,
    quotee: quotee ? quotee : source.author.name,
    meta
  }

  return quoteInput
}

QuoteRouter.get('/', async (req, res) => {
  const quotes = await prisma.quote.findMany({
    include: {
      source: true,
      tags: true
    },
  })

  res.json(quotes)
})

QuoteRouter.post('/', async (req, res) => {
  const data = formatQuoteInput(req.body)
  res.json(await prisma.quote.create({ data }))
})

QuoteRouter.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const data = formatQuoteInput(req.body)
  console.log(data)
  const quote = await prisma.quote.update({
    where: { id },
    data
  })
  res.json(quote)
})

QuoteRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  const result = await prisma.quote.delete({
    where: {
      createdAt: new Date(id),
    },
  })
  res.json(result)
})

export default QuoteRouter