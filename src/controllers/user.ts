import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
import { map } from 'lodash'

const prisma = new PrismaClient()

/* Create Quotes Router */
const UserRouter = express.Router()

// Users
UserRouter.get('/', async (_, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

// Get User Favorites
UserRouter.get('/:id/favorites', async (req, res) => {
  const { id } = req.params

  const favorites = await prisma.userFavorite.findMany({
    where: {
      userId: Number(id),
    },
    select: {
      quoteId: true,
    },
  })

  res.json(map(favorites, 'quoteId'))
})

UserRouter.post('/', async (req, res) => {
  const { name } = req.body

  const data: Prisma.UserCreateInput = {
    name,
  }

  await prisma.user.create({ data })
  res.redirect('/users')
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
