import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
const cors = require('cors');

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors({ origin: '*' }));

app.get('/quotes', async (req, res) => {
  const quotes = await prisma.quote.findMany({
    include: {
      source: true
    }
  })
  res.json(quotes)
})

app.post('/quotes', async (req, res) => {
  const { source, content, quotee, createdAt, meta} = req.body

  const data: Prisma.QuoteCreateInput = {
    createdAt: new Date(createdAt),
    source: {
      connect: {
        id: source.id
      }
    },
    content,
    quotee: quotee ? quotee : source.author.name,
    meta
  }
  console.log(data)
  await prisma.quote.create({ data })
  res.redirect('/quotes')
})

app.put('/quotes/:createdAt', async (req, res) => {
  // const {  } = req.params
  // console.log(createdAt)
  const { source, content, quotee, meta, createdAt } = req.body

  const data: Prisma.QuoteUpdateInput = {
    source: {
      connect: {
        id: source.id
      }
    },
    content,
    quotee: quotee ? quotee : source.author.name,
    meta,
    createdAt
  }
  await prisma.quote.update({
    where: { createdAt: new Date(createdAt) },
    data
  })
  res.redirect(303, '/quotes')
})

app.delete('/quotes/:id', async (req, res) => {
  const { id } = req.params

  const result = await prisma.quote.delete({
    where: {
      createdAt: new Date(id),
    },
  })
  res.json(result)
})

app.get('/authors', async (req, res) => {
  const authors = await prisma.author.findMany()
  res.json(authors)
})

app.post('/authors', async (req, res) => {
  const { name } = req.body

  const data: Prisma.AuthorCreateInput = {
    name
  }
  
  const result = await prisma.author.create({ data })
  res.json(result)
})

app.delete('/authors/:id', async (req, res) => {
  const { id } = req.params

  const result = await prisma.author.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(result)
})

app.get('/books', async (req, res) => {
  const books = await prisma.book.findMany({ 
    include: {
      author: true
    } 
  })
  res.json(books)
})

app.post('/books', async (req, res) => {
  const { author, title } = req.body

  console.log(req.body)

  const data: Prisma.BookCreateInput = {
    author: {
      connect: {
        id: author.id
      }
    },
    title,
  }
  
  const result = await prisma.book.create({ data })
  res.redirect('/books');
})

app.delete('/books/:id', async (req, res) => {
  const { id } = req.params

  const result = await prisma.book.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(result)
})

// app.post(`/signup`, async (req, res) => {
//   const { name, email, posts } = req.body

//   const postData = posts?.map((post: Prisma.PostCreateInput) => {
//     return { title: post?.title, content: post?.content }
//   })

//   const result = await prisma.user.create({
//     data: {
//       name,
//       email,
//       posts: {
//         create: postData,
//       },
//     },
//   })
//   res.json(result)
// })

// app.post(`/post`, async (req, res) => {
//   const { title, content, authorEmail } = req.body
//   const result = await prisma.post.create({
//     data: {
//       title,
//       content,
//       author: { connect: { email: authorEmail } },
//     },
//   })
//   res.json(result)
// })

// app.put('/post/:id/views', async (req, res) => {
//   const { id } = req.params

//   try {
//     const post = await prisma.post.update({
//       where: { id: Number(id) },
//       data: {
//         viewCount: {
//           increment: 1,
//         },
//       },
//     })

//     res.json(post)
//   } catch (error) {
//     res.json({ error: `Post with ID ${id} does not exist in the database` })
//   }
// })

// app.put('/publish/:id', async (req, res) => {
//   const { id } = req.params

//   try {
//     const postData = await prisma.post.findUnique({
//       where: { id: Number(id) },
//       select: {
//         published: true,
//       },
//     })

//     const updatedPost = await prisma.post.update({
//       where: { id: Number(id) || undefined },
//       data: { published: !postData?.published },
//     })
//     res.json(updatedPost)
//   } catch (error) {
//     res.json({ error: `Post with ID ${id} does not exist in the database` })
//   }
// })

// app.delete(`/post/:id`, async (req, res) => {
//   const { id } = req.params
//   const post = await prisma.post.delete({
//     where: {
//       id: Number(id),
//     },
//   })
//   res.json(post)
// })

// app.get('/users', async (req, res) => {
//   const users = await prisma.user.findMany()
//   res.json(users)
// })

// app.get('/user/:id/drafts', async (req, res) => {
//   const { id } = req.params

//   const drafts = await prisma.user
//     .findUnique({
//       where: {
//         id: Number(id),
//       },
//     })
//     .posts({
//       where: { published: false },
//     })

//   res.json(drafts)
// })

// app.get(`/post/:id`, async (req, res) => {
//   const { id }: { id?: string } = req.params

//   const post = await prisma.post.findUnique({
//     where: { id: Number(id) },
//   })
//   res.json(post)
// })

// app.get('/feed', async (req, res) => {
//   const { searchString, skip, take, orderBy } = req.query

//   const or: Prisma.PostWhereInput = searchString
//     ? {
//         OR: [
//           { title: { contains: searchString as string } },
//           { content: { contains: searchString as string } },
//         ],
//       }
//     : {}

//   const posts = await prisma.post.findMany({
//     where: {
//       published: true,
//       ...or,
//     },
//     include: { author: true },
//     take: Number(take) || undefined,
//     skip: Number(skip) || undefined,
//     orderBy: {
//       updatedAt: orderBy as Prisma.SortOrder,
//     },
//   })

//   res.json(posts)
// })

const server = app.listen(8000, () =>
  console.log(`
🚀 Server ready at: http://localhost:8000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)
