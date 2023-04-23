import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()

/* Create Quotes Router */
const SnippetsRouter = express.Router()

// Books
SnippetsRouter.get('/', async (req, res) => {
  const snippets = await prisma.snippet.findMany({
    include: {
      source: true,
    },
  })
  const quotes = (await prisma.quote.findMany()).map(({ createdAt }) => createdAt) || []
  res.json(snippets.map(snippet => ({ ...snippet, staged: quotes.includes(snippet.createdAt) })))
})

SnippetsRouter.post('/', async (req, res) => {
  const allSources = await prisma.source.findMany()

  // Create sources if they don't exist
  const sourceStrings = new Set<string>(req.body.map(({ source }: any) => source))
  for (const sourceString of Array.from(sourceStrings)) {
    if (!allSources.find(({ string }) => string === sourceString)) {
      // ex The 7 Habits of Highly Effective People (Covey, Stephen R.)
      const [title, author] = sourceString.split(' (')
      let authorName = author.replace(')', '') // Covey, Stephen R.
      if (authorName.includes(', ')) {
        authorName = authorName.split(', ').reverse().join(' ') // Covey, Stephen R. => Covey, Stephen R. => Stephen R., Covey
      }
      const source = await prisma.source.create({
        data: {
          string: sourceString,
          book: {
            connectOrCreate: {
              create: {
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
              where: {
                title,
              },
            },
          },
        },
        include: {
          book: true,
        },
      })
      allSources.push(source)
    }
  }

  const data = req.body.map(({ createdAt, meta, content, source: sourceString, user }: any) => {
    let source = allSources.find(({ string }) => string === sourceString)!
    return {
      createdAt: new Date(createdAt),
      meta,
      content,
      user: {
        connect: {
          id: user.id,
        },
      },
      source: {
        connect: {
          id: source.id,
        },
      },
      deleted: false,
    } as Prisma.SnippetCreateInput
  })

  const results = []

  for (const snippet of data) {
    try {
      const saved = await prisma.snippet.create({ data: snippet })
      results.push(saved)
    } catch (e) {
      console.log(e)
    }
  }

  res.json(results.filter(Boolean))
})

SnippetsRouter.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const snippet = await prisma.snippet.update({
    where: { id },
    data: req.body,
  })
  console.log(req.body)
  res.json(snippet)
})

SnippetsRouter.delete('/:id?', async (req, res) => {
  const { id } = req.params

  if (!id) {
    res.json(await prisma.snippet.deleteMany())
  } else {
    const result = await prisma.snippet.update({
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

export default SnippetsRouter
