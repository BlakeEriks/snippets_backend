import express from 'express'
import { Prisma, PrismaClient, Tag } from '@prisma/client';

const prisma = new PrismaClient()

/* Create Quotes Router */
const TagRouter = express.Router()

// Tags
TagRouter.get('/tags', async (req, res) => {
  const tags = await prisma.tag.findMany({
    include: {
      quotes: true
    }
  })
  res.json(tags)
})

TagRouter.post('/tags', async (req, res) => {
  const { name } = req.body

  const data: Prisma.TagCreateInput = {
    name
  }
  
  const result = await prisma.tag.create({ data })
  res.redirect('/tags');
})

export default TagRouter