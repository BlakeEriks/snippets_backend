import { Book, Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
import { find } from 'lodash'

const prisma = new PrismaClient()

/* Create Quotes Router */
const QuoteRouter = express.Router()

// Quotes
QuoteRouter.get('/', async (req, res) => {
  const quotes = await prisma.quote.findMany({
    include: {
      book: true,
    },
    where: {
      deleted: false,
    },
  })

  res.json(quotes)
})

QuoteRouter.get('/:id', async (req, res) => {
  const { id } = req.params

  const quote = await prisma.quote.findUnique({
    where: {
      id: Number(id),
    },
  })
  res.json(quote)
})

/**
 * Post a new quote
 */
QuoteRouter.post('/', async (req, res) => {
  const { book, user, ...data } = req.body

  data.createdAt = new Date()
  data.userId = user.id
  data.bookId = book.id

  const result = await prisma.quote.create({ data })
  res.json(result)
})

/**
 * Upload clippings from a MyClippings.txt file
 */
QuoteRouter.post('/upload', async (req, res) => {
  const allBooks = await prisma.book.findMany()
  const sourceStrings = new Set<string>(req.body.map(({ source }: Book) => source))

  // Create books from source strings if they don't yet exist
  for (const sourceString of Array.from(sourceStrings)) {
    if (allBooks.find(({ source }) => source === sourceString)) continue

    // ex The 7 Habits of Highly Effective People (Covey, Stephen R.)
    const [title, author] = sourceString.split(' (')
    let authorName = author.replace(')', '') // Covey, Stephen R.
    if (authorName.includes(', ')) {
      authorName = authorName.split(', ').reverse().join(' ') // Covey, Stephen R. => Covey, Stephen R. => Stephen R. Covey
    }
    const book = await prisma.book.create({
      data: {
        source: sourceString,
        title,
        author: {
          connectOrCreate: {
            create: {
              name: authorName,
            },
            where: {
              name: authorName,
            },
          },
        },
      },
    })
    allBooks.push(book)
  }

  const quotes = req.body.map(
    ({ createdAt, meta, content, source, user }: any): Prisma.QuoteCreateInput => {
      let { id } = find(allBooks, { source })!

      return {
        createdAt: new Date(createdAt),
        meta,
        content,
        user: {
          connect: {
            id: user.id,
          },
        },
        book: {
          connect: {
            id,
          },
        },
      }
    }
  )

  const results = []

  for (const data of quotes) {
    try {
      const saved = await prisma.quote.create({ data })
      results.push(saved)
    } catch (e) {
      console.log(e)
    }
  }

  res.json(results.filter(Boolean))
})

QuoteRouter.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const { user, ...data } = req.body
  if (user) {
    data.userId = user.id
  }
  const quote = await prisma.quote.update({
    where: { id },
    data,
  })
  res.json(quote)
})

QuoteRouter.delete('/:id?', async (req, res) => {
  const { id } = req.params

  if (!id) {
    res.json(await prisma.quote.deleteMany())
  } else {
    const result = await prisma.quote.update({
      where: {
        id: Number(id),
      },
      data: {
        deleted: true,
      },
    })
    res.json(result)
  }
})

export default QuoteRouter
