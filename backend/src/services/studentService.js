import { pool } from '../db/pool.js'

export const listStudents = async ({ keyword, classId, offset, limit, page, pageSize }) => {
  const conditions = []
  const params = []

  if (keyword) {
    params.push(`%${keyword}%`)
    conditions.push(`(s.student_no ILIKE $${params.length} OR s.name ILIKE $${params.length})`)
  }

  if (classId) {
    params.push(classId)
    conditions.push(`s.class_id = $${params.length}`)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const countSql = `
    SELECT COUNT(*)::int AS total
    FROM students s
    ${where}
  `
  const total = (await pool.query(countSql, params)).rows[0]?.total || 0

  const listSql = `
    SELECT
      s.id,
      s.student_no,
      s.name,
      s.gender,
      s.birthdate,
      s.class_id,
      c.name AS class_name,
      c.grade AS class_grade,
      s.phone,
      s.email,
      s.is_active,
      s.created_at
    FROM students s
    LEFT JOIN classes c ON c.id = s.class_id
    ${where}
    ORDER BY s.id DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `
  const items = (await pool.query(listSql, [...params, limit, offset])).rows

  return { items, total, page, pageSize }
}

export const createStudent = async (payload) => {
  const sql = `
    INSERT INTO students (
      student_no, name, gender, birthdate, class_id, phone, email, is_active
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `
  const params = [
    payload.studentNo,
    payload.name,
    payload.gender,
    payload.birthdate || null,
    payload.classId ?? null,
    payload.phone || null,
    payload.email || null,
    payload.isActive
  ]
  const { rows } = await pool.query(sql, params)
  return rows[0]
}

export const updateStudentById = async (id, payload) => {
  const sql = `
    UPDATE students
    SET
      student_no = $1,
      name = $2,
      gender = $3,
      birthdate = $4,
      class_id = $5,
      phone = $6,
      email = $7,
      is_active = $8
    WHERE id = $9
    RETURNING *
  `
  const params = [
    payload.studentNo,
    payload.name,
    payload.gender,
    payload.birthdate || null,
    payload.classId ?? null,
    payload.phone || null,
    payload.email || null,
    payload.isActive,
    id
  ]
  const { rows } = await pool.query(sql, params)
  return rows[0]
}

export const deleteStudentById = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM students WHERE id = $1', [id])
  return rowCount > 0
}
