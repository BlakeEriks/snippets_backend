import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()

/* Create Quotes Router */
const BookRouter = express.Router()

// Books
BookRouter.get('/', async (req, res) => {
  const params = req.query
  const where: any = {}
  if (params.staged) {
    where.staged = params.staged === 'true'
  }
  if (params.deleted) {
    where.deleted = params.deleted === 'true'
  }

  const books = await prisma.book.findMany({
    include: {
      author: true,
      quotes: {
        where,
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
    orderBy: {
      quotes: {
        _count: 'desc',
      },
    },
  })
  res.json(books)
})

BookRouter.post('/', async (req, res) => {
  const { author, title } = req.body

  const data: Prisma.BookCreateInput = {
    author: {
      connect: {
        id: author.id,
      },
    },
    title,
  }

  res.json(await prisma.book.create({ data }))
})

BookRouter.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id)

  const book = await prisma.book.update({
    where: { id },
    data: req.body,
  })

  res.json(book)
})

BookRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  const result = await prisma.book.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(result)
})

export default BookRouter
