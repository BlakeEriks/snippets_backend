import { PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()

/* Create Quotes Router */
const SourceRouter = express.Router()

// sources
SourceRouter.get('/', async (req, res) => {
  const sources = await prisma.source.findMany()
  res.json(sources)
})

// SourceRouter.post('/', async (req, res) => {
//   const { name } = req.body

//   const data: Prisma.SourceCreateInput = {
//     name
//   }

//   const result = await prisma.source.create({ data })
//   res.redirect('/sources');
// })

SourceRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  const result = await prisma.source.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(result)
})

export default SourceRouter
