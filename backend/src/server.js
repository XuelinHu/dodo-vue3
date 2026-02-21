import cors from 'cors'
import express from 'express'
import userRoutes from './routes/userRoutes.js'
import geoRoutes from './routes/geoRoutes.js'
import classRoutes from './routes/classRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import scoreRoutes from './routes/scoreRoutes.js'
import { env } from './config/env.js'
import { initDb } from './db/initDb.js'
import { errorHandler } from './middleware/errorHandler.js'
import { getCapabilities } from './db/capabilities.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', async (req, res) => {
  const capabilities = await getCapabilities()
  res.json({ status: 'ok', capabilities })
})

app.get('/api/capabilities', async (req, res) => {
  const capabilities = await getCapabilities()
  res.json({ code: 0, message: 'ok', data: capabilities })
})

app.use('/api/users', userRoutes)
app.use('/api/geo', geoRoutes)
app.use('/api/classes', classRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/scores', scoreRoutes)
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
