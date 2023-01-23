import express from 'express'
import { Prisma, PrismaClient, Tag } from '@prisma/client';

const prisma = new PrismaClient()

/* Create Quotes Router */
const AuthorRouter = express.Router()

// Authors
AuthorRouter.get('/authors', async (req, res) => {
  const authors = await prisma.author.findMany()
  res.json(authors)
})

AuthorRouter.post('/authors', async (req, res) => {
  const { name } = req.body

  const data: Prisma.AuthorCreateInput = {
    name
  }
  
  const result = await prisma.author.create({ data })
  res.json(result)
})

AuthorRouter.delete('/authors/:id', async (req, res) => {
  const { id } = req.params

  const result = await prisma.author.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(result)
})

export default AuthorRouter