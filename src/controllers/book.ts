import express from 'express'
import { Prisma, PrismaClient, Tag } from '@prisma/client';

const prisma = new PrismaClient()

/* Create Quotes Router */
const BookRouter = express.Router()

// Books
BookRouter.get('/', async (req, res) => {
  const books = await prisma.book.findMany({ 
    include: {
      author: true
    } 
  })
  res.json(books)
})

BookRouter.post('/', async (req, res) => {
  const { author, title } = req.body

  const data: Prisma.BookCreateInput = {
    author: {
      connect: {
        id: author.id
      }
    },
    title,
  }
  
  res.json(await prisma.book.create({ data }))
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