import express from 'express'
import { Prisma, PrismaClient, Tag } from '@prisma/client';

const prisma = new PrismaClient()

/* Create Quotes Router */
const UserRouter = express.Router()

// Users
UserRouter.get('/', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

UserRouter.post('/', async (req, res) => {
  const { name } = req.body

  const data: Prisma.UserCreateInput = {
    name
  }
  
  const result = await prisma.user.create({ data })
  res.redirect('/users');
})

UserRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  const result = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(result)
})

export default UserRouter