import { pool } from '../db/pool.js'

export const listGeoItems = async () => {
  // PostgreSQL 特殊数据类型核心知识点：POINT 直接转 text，GEOMETRY 用 ST_AsText 输出
  const sql = `
    SELECT id, name, location::text AS location_text,
           ST_X(location::point) AS longitude,
           ST_Y(location::point) AS latitude,
           ST_AsText(area) AS polygon_wkt
    FROM geo_items
    ORDER BY id DESC
  `
  const { rows } = await pool.query(sql)
  return rows
}

export const createGeoItem = async (payload) => {
  const sql = `
    INSERT INTO geo_items (name, location, area)
    VALUES ($1, point($2, $3), ST_GeomFromText($4, 4326))
    RETURNING id, name, location::text AS location_text, ST_AsText(area) AS polygon_wkt
  `
  const params = [payload.name, payload.longitude, payload.latitude, payload.polygonWkt]
  const { rows } = await pool.query(sql, params)
  return rows[0]
}

export const updateGeoItemById = async (id, payload) => {
  const sql = `
    UPDATE geo_items
    SET name = $1,
        location = point($2, $3),
        area = ST_GeomFromText($4, 4326)
    WHERE id = $5
    RETURNING id, name, location::text AS location_text, ST_AsText(area) AS polygon_wkt
  `
  const params = [payload.name, payload.longitude, payload.latitude, payload.polygonWkt, id]
  const { rows } = await pool.query(sql, params)
  return rows[0]
}

export const deleteGeoItemById = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM geo_items WHERE id = $1', [id])
  return rowCount > 0
}
