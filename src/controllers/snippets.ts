import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()

/* Create Quotes Router */
const SnippetsRouter = express.Router()

// Books
SnippetsRouter.get('/', async (req, res) => {
  const snippets = await prisma.snippet.findMany()
  const quotes = (await prisma.quote.findMany()).map(({ createdAt }) => createdAt) || []
  res.json(snippets.map(snippet => ({ ...snippet, staged: quotes.includes(snippet.createdAt) })))
})

SnippetsRouter.post('/', async (req, res) => {
  const sources = await prisma.source.findMany()

  const data = await Promise.all<Prisma.SnippetCreateInput[]>(
    req.body.map(async ({ createdAt, meta, content, source: sourceString }: any) => {
      let source = sources.find(({ string }) => string === sourceString)

      if (!source) {
        // ex The 7 Habits of Highly Effective People (Covey, Stephen R.)
        const [title, author] = sourceString.split(' (')
        let authorName = author.replace(')', '') // Covey, Stephen R.
        if (authorName.includes(',')) {
          authorName = authorName.split(', ').reverse().join(' ') // Covey, Stephen R. => Covey, Stephen R. => Stephen R., Covey
        }
        source = await prisma.source.create({
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
        })
      }

      return {
        createdAt: new Date(createdAt),
        meta,
        content,
        source,
        deleted: false,
      } as Prisma.SnippetCreateInput
    })
  )

  const results = await Promise.all(
    data.map(async snippet => {
      try {
        const saved = await prisma.snippet.create({ data: snippet })
        return saved
      } catch (e) {
        console.log(e)
      }
    })
  )

  res.json(results.filter(Boolean))
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
