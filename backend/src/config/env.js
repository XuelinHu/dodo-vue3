import dotenv from 'dotenv'

dotenv.config()

const buildDatabaseUrlFromParts = () => {
  const host = process.env.DB_HOST
  const port = process.env.DB_PORT || '5432'
  const name = process.env.DB_NAME
  const user = process.env.DB_USER
  const password = process.env.DB_PASSWORD

  if (!host || !name || !user) return null

  const encodedUser = encodeURIComponent(user)
  const encodedPassword = password != null ? encodeURIComponent(password) : ''
  const auth = encodedPassword ? `${encodedUser}:${encodedPassword}` : encodedUser
  const encodedName = encodeURIComponent(name)

  return `postgresql://${auth}@${host}:${port}/${encodedName}`
}

export const env = {
  port: Number(process.env.PORT || 3000),
  databaseUrl:
    process.env.DATABASE_URL ||
    buildDatabaseUrlFromParts() ||
    'postgresql://postgres:postgres@localhost:5432/dodo_vue3',
  nodeEnv: process.env.NODE_ENV || 'development'
}
