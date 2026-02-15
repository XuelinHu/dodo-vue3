import cors from 'cors'
import express from 'express'
import userRoutes from './routes/userRoutes.js'
import geoRoutes from './routes/geoRoutes.js'
import { env } from './config/env.js'
import { initDb } from './db/initDb.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/users', userRoutes)
app.use('/api/geo', geoRoutes)
app.use(errorHandler)

const bootstrap = async () => {
  await initDb()
  app.listen(env.port, () => {
    console.log(`Backend running at http://localhost:${env.port}`)
  })
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err)
  process.exit(1)
})
