-- 班级：基础数据
INSERT INTO classes (name, grade)
VALUES
  ('一班', 2024),
  ('二班', 2024),
  ('三班', 2024)
ON CONFLICT (name, grade) DO NOTHING;

-- 学生：基础数据
INSERT INTO students (student_no, name, gender, birthdate, class_id, phone, email, is_active)
VALUES
  (
    'S20240001',
    '张三',
    'male',
    '2006-05-12',
    (SELECT id FROM classes WHERE name = '一班' AND grade = 2024 LIMIT 1),
    '13800000001',
    'zhangsan@example.com',
    TRUE
  ),
  (
    'S20240002',
    '李四',
    'female',
    '2006-10-03',
    (SELECT id FROM classes WHERE name = '二班' AND grade = 2024 LIMIT 1),
    '13800000002',
    'lisi@example.com',
    TRUE
  ),
  (
    'S20240003',
    '王五',
    'male',
    '2006-01-22',
    (SELECT id FROM classes WHERE name = '三班' AND grade = 2024 LIMIT 1),
    '13800000003',
    'wangwu@example.com',
    TRUE
  )
ON CONFLICT (student_no) DO NOTHING;

-- 成绩：基础数据
INSERT INTO student_scores (student_id, subject, score, exam_date)
VALUES
  ((SELECT id FROM students WHERE student_no = 'S20240001'), '数学', 92.5, '2024-11-01'),
  ((SELECT id FROM students WHERE student_no = 'S20240001'), '英语', 88.0, '2024-11-01'),
  ((SELECT id FROM students WHERE student_no = 'S20240002'), '数学', 96.0, '2024-11-01'),
  ((SELECT id FROM students WHERE student_no = 'S20240002'), '英语', 90.5, '2024-11-01'),
  ((SELECT id FROM students WHERE student_no = 'S20240003'), '数学', 85.0, '2024-11-01'),
  ((SELECT id FROM students WHERE student_no = 'S20240003'), '英语', 82.0, '2024-11-01')
ON CONFLICT (student_id, subject, exam_date) DO NOTHING;
