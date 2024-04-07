// YOUR_BASE_DIRECTORY/netlify/functions/api.ts
import cors from 'cors'
import express from 'express'
import serverless from 'serverless-http'
import AuthorRouter from '../../src/controllers/author'
import BookRouter from '../../src/controllers/book'
import QuoteRouter from '../../src/controllers/quote'
import TagRouter from '../../src/controllers/tag'
import UserRouter from '../../src/controllers/user'

const api = express()

api.use(express.json())
api.use(cors({ origin: '*' }))

api.use('/quotes', QuoteRouter)
api.use('/authors', AuthorRouter)
api.use('/books', BookRouter)
api.use('/users', UserRouter)
api.use('/tags', TagRouter)

export const handler = serverless(api)
