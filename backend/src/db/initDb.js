import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from './pool.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const initDb = async () => {
  const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8')
  await pool.query(sql)
}
