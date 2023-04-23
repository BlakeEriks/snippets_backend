import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()

/* Create Quotes Router */
const AuthorRouter = express.Router()

// Authors
AuthorRouter.get('/', async (req, res) => {
  const authors = await prisma.author.findMany()
  res.json(authors)
})

AuthorRouter.post('/', async (req, res) => {
  const { name } = req.body

  const data: Prisma.AuthorCreateInput = {
    name,
  }

  const result = await prisma.author.create({ data })
  res.json(result)
})

AuthorRouter.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id)

  const author = await prisma.author.update({
    where: { id },
    data: req.body,
  })

  res.json(author)
})

AuthorRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  const result = await prisma.author.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(result)
})

export default AuthorRouter
