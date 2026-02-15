import { pool } from '../db/pool.js'

export const listUsers = async () => {
  const { rows } = await pool.query('SELECT * FROM users ORDER BY id DESC')
  return rows
}

export const createUser = async (payload) => {
  const sql = `
    INSERT INTO users (name, age, salary, birthday, is_active)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `
  const params = [payload.name, payload.age, payload.salary, payload.birthday, payload.isActive]
  const { rows } = await pool.query(sql, params)
  return rows[0]
}

export const updateUserById = async (id, payload) => {
  const sql = `
    UPDATE users
    SET name = $1, age = $2, salary = $3, birthday = $4, is_active = $5
    WHERE id = $6
    RETURNING *
  `
  const params = [payload.name, payload.age, payload.salary, payload.birthday, payload.isActive, id]
  const { rows } = await pool.query(sql, params)
  return rows[0]
}

export const deleteUserById = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id])
  return rowCount > 0
}
