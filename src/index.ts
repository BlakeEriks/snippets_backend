import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import AuthorRouter from './controllers/author'
import BookRouter from './controllers/book'
import QuoteRouter from './controllers/quote'
import TagRouter from './controllers/tag'
import UserRouter from './controllers/user'

// const prisma = new PrismaClient()
const app = express()

app.use(morgan('tiny'))
app.use(express.json())
app.use(cors({ origin: '*' }))

const baseRouter = express.Router()

baseRouter.use('/quotes', QuoteRouter)
baseRouter.use('/authors', AuthorRouter)
baseRouter.use('/books', BookRouter)
baseRouter.use('/users', UserRouter)
baseRouter.use('/tags', TagRouter)

app.use('/api', baseRouter)

app.listen(8000, () =>
  console.log(`
    🚀 Server ready at: http://localhost:8000
    ⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api
  `)
)
