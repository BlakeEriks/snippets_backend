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

const baseRouter = express.Router()
baseRouter.use('/quotes', QuoteRouter)
baseRouter.use('/authors', AuthorRouter)
baseRouter.use('/books', BookRouter)
baseRouter.use('/users', UserRouter)
baseRouter.use('/tags', TagRouter)

api.use('/api', baseRouter)

export const handler = serverless(api)
