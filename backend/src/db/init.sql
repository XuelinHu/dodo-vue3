-- PostGIS 是可选能力：如果数据库服务器未安装 PostGIS，则跳过 GIS 相关扩展/表
DO $$
BEGIN
  BEGIN
    CREATE EXTENSION IF NOT EXISTS postgis;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'PostGIS extension not available, skip GIS features.';
  END;
END
$$;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  salary NUMERIC(10,2) NOT NULL,
  birthday DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
    CREATE TABLE IF NOT EXISTS geo_items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      location POINT NOT NULL,
      area GEOMETRY(POLYGON, 4326),
      created_at TIMESTAMP DEFAULT NOW()
    );
  END IF;
END
$$;

-- 学生信息管理：班级 / 学生 / 成绩（不依赖 PostGIS）
CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  grade INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (name, grade)
);

CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  student_no VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  gender VARCHAR(10) NOT NULL DEFAULT 'unknown',
  birthdate DATE,
  class_id INT REFERENCES classes(id) ON DELETE SET NULL,
  phone VARCHAR(30),
  email VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_scores (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject VARCHAR(50) NOT NULL,
  score NUMERIC(5,2) NOT NULL,
  exam_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (student_id, subject, exam_date)
);
