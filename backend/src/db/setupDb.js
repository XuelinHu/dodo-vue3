import fs from 'fs'
import path from 'path'
import pg from 'pg'
import { fileURLToPath } from 'url'
import { env } from '../config/env.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const quoteIdent = (value) => `"${String(value).replaceAll('"', '""')}"`

const maskDatabaseUrl = (databaseUrl) => {
  try {
    const url = new URL(databaseUrl)
    if (url.password) url.password = '***'
    return url.toString()
  } catch {
    return '<invalid DATABASE_URL>'
  }
}

const getDatabaseNameFromUrl = (databaseUrl) => {
  const url = new URL(databaseUrl)
  const name = url.pathname.replace(/^\//, '')
  if (!name) throw new Error('DATABASE_URL 缺少数据库名（pathname 为空）')
  return name
}

const withDatabase = (databaseUrl, databaseName) => {
  const url = new URL(databaseUrl)
  url.pathname = `/${databaseName}`
  return url.toString()
}

const ensureDatabaseExists = async (databaseUrl) => {
  const targetDbName = getDatabaseNameFromUrl(databaseUrl)
  const adminUrl = withDatabase(databaseUrl, 'postgres')

  const adminClient = new pg.Client({ connectionString: adminUrl })
  await adminClient.connect()

  try {
    const { rows } = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDbName]
    )

    if (rows.length > 0) return

    await adminClient.query(`CREATE DATABASE ${quoteIdent(targetDbName)}`)
  } finally {
    await adminClient.end()
  }
}

const runInitSql = async (databaseUrl) => {
  const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8')
  const client = new pg.Client({ connectionString: databaseUrl })
  await client.connect()
  try {
    await client.query(sql)
  } finally {
    await client.end()
  }
}

const main = async () => {
  const databaseUrl = env.databaseUrl

  console.log(`Using DATABASE_URL: ${maskDatabaseUrl(databaseUrl)}`)

  await ensureDatabaseExists(databaseUrl)
  await runInitSql(databaseUrl)

  console.log('Database initialized successfully.')
}

main().catch((err) => {
  console.error('Database initialization failed.')

  const errors = err?.errors && Array.isArray(err.errors) ? err.errors : [err]
  const allConnRefused =
    errors.length > 0 && errors.every((e) => e && e.code === 'ECONNREFUSED')

  if (allConnRefused) {
    console.error('无法连接到 PostgreSQL（连接被拒绝）。')
    console.error(
      '请确认 PostgreSQL 已启动、端口可达，并检查 `backend/.env` 中的 DATABASE_URL / DB_HOST 等配置。'
    )
  }

  const isPostgisMissing =
    err &&
    typeof err.message === 'string' &&
    err.message.includes('extension "postgis" is not available')

  if (isPostgisMissing) {
    console.error('检测到 PostGIS 扩展不可用（服务器未安装 PostGIS）。')
    console.error(
      '请在数据库服务器上安装 PostGIS 后再执行初始化；或改用已包含 PostGIS 的 PostgreSQL 实例。'
    )
  }

  console.error(err)
  process.exit(1)
})
