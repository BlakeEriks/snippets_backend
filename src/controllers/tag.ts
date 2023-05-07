import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()

/* Create Quotes Router */
const TagRouter = express.Router()

// Tags
TagRouter.get('/', async (req, res) => {
  const tags = await prisma.tag.findMany({
    include: {
      quotes: true,
    },
  })
  res.json(tags)
})

TagRouter.post('/', async (req, res) => {
  const { name } = req.body

  const data: Prisma.TagCreateInput = {
    name,
  }

  const result = await prisma.tag.create({ data })
  res.redirect('/tags')
})

TagRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  const result = await prisma.tag.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(result)
})

export default TagRouter
