import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from './pool.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const seedDb = async () => {
  const sql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8')
  await pool.query(sql)
}

const main = async () => {
  await seedDb()
  console.log('Database seeded successfully.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Database seed failed.')
  console.error(err)
  process.exit(1)
})
