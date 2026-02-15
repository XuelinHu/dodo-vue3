import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/dodo_vue3',
  nodeEnv: process.env.NODE_ENV || 'development'
}
