import { pool } from './pool.js'

let cached = null
let cachedAt = 0
const TTL_MS = 10_000

export const getCapabilities = async () => {
  const now = Date.now()
  if (cached && now - cachedAt < TTL_MS) return cached

  const capabilities = {
    db: false,
    postgis: false
  }

  try {
    const dbOk = await pool.query('SELECT 1 AS ok')
    capabilities.db = dbOk.rowCount === 1

    const { rows } = await pool.query(
      "SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') AS postgis"
    )
    capabilities.postgis = Boolean(rows[0]?.postgis)
  } catch {
    // ignore
  }

  cached = capabilities
  cachedAt = now
  return capabilities
}
