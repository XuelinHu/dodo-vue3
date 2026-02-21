import { pool } from '../db/pool.js'

export const listScores = async ({ keyword, subject, offset, limit, page, pageSize }) => {
  const conditions = []
  const params = []

  if (keyword) {
    params.push(`%${keyword}%`)
    conditions.push(`(s.student_no ILIKE $${params.length} OR s.name ILIKE $${params.length})`)
  }

  if (subject) {
    params.push(`%${subject}%`)
    conditions.push(`sc.subject ILIKE $${params.length}`)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const countSql = `
    SELECT COUNT(*)::int AS total
    FROM student_scores sc
    JOIN students s ON s.id = sc.student_id
    ${where}
  `
  const total = (await pool.query(countSql, params)).rows[0]?.total || 0

  const listSql = `
    SELECT
      sc.id,
      sc.student_id,
      s.student_no,
      s.name AS student_name,
      sc.subject,
      sc.score,
      sc.exam_date,
      sc.created_at
    FROM student_scores sc
    JOIN students s ON s.id = sc.student_id
    ${where}
    ORDER BY sc.id DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `
  const items = (await pool.query(listSql, [...params, limit, offset])).rows

  return { items, total, page, pageSize }
}

export const createScore = async (payload) => {
  const sql = `
    INSERT INTO student_scores (student_id, subject, score, exam_date)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `
  const params = [payload.studentId, payload.subject, payload.score, payload.examDate]
  const { rows } = await pool.query(sql, params)
  return rows[0]
}

export const updateScoreById = async (id, payload) => {
  const sql = `
    UPDATE student_scores
    SET student_id = $1, subject = $2, score = $3, exam_date = $4
    WHERE id = $5
    RETURNING *
  `
  const params = [payload.studentId, payload.subject, payload.score, payload.examDate, id]
  const { rows } = await pool.query(sql, params)
  return rows[0]
}

export const deleteScoreById = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM student_scores WHERE id = $1', [id])
  return rowCount > 0
}

export const getSubjectAvgStats = async () => {
  const sql = `
    SELECT subject, ROUND(AVG(score)::numeric, 2) AS avg_score, COUNT(*)::int AS count
    FROM student_scores
    GROUP BY subject
    ORDER BY subject ASC
  `
  const { rows } = await pool.query(sql)
  return rows
}
