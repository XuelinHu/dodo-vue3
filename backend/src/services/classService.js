import { pool } from '../db/pool.js'

export const listClasses = async ({ keyword, offset, limit, page, pageSize }) => {
  const where = keyword ? 'WHERE name ILIKE $1' : ''
  const params = []
  if (keyword) params.push(`%${keyword}%`)

  const countSql = `SELECT COUNT(*)::int AS total FROM classes ${where}`
  const total = (await pool.query(countSql, params)).rows[0]?.total || 0

  const listSql = `
    SELECT id, name, grade, created_at
    FROM classes
    ${where}
    ORDER BY id DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `
  const listParams = [...params, limit, offset]
  const items = (await pool.query(listSql, listParams)).rows

  return { items, total, page, pageSize }
}

export const createClass = async (payload) => {
  const sql = `
    INSERT INTO classes (name, grade)
    VALUES ($1, $2)
    RETURNING *
  `
  const { rows } = await pool.query(sql, [payload.name, payload.grade])
  return rows[0]
}

export const updateClassById = async (id, payload) => {
  const sql = `
    UPDATE classes
    SET name = $1, grade = $2
    WHERE id = $3
    RETURNING *
  `
  const { rows } = await pool.query(sql, [payload.name, payload.grade, id])
  return rows[0]
}

export const deleteClassById = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM classes WHERE id = $1', [id])
  return rowCount > 0
}
