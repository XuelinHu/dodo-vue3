import { z } from 'zod'
import { success, fail } from '../middleware/response.js'
import { parsePagination } from '../utils/pagination.js'
import * as studentService from '../services/studentService.js'

export const studentSchema = z.object({
  studentNo: z.string().min(1, '学号必填'),
  name: z.string().min(1, '姓名必填'),
  gender: z.enum(['male', 'female', 'unknown']).default('unknown'),
  birthdate: z.string().optional().nullable(),
  classId: z.number().int().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email('邮箱格式不正确').optional().nullable(),
  isActive: z.boolean().default(true)
})

export const getStudents = async (req, res, next) => {
  try {
    const { page, pageSize, offset, limit } = parsePagination(req.query)
    const keyword = (req.query.keyword || '').toString().trim()
    const classId = req.query.classId ? Number(req.query.classId) : null
    const data = await studentService.listStudents({ keyword, classId, offset, limit, page, pageSize })
    return success(res, data)
  } catch (err) {
    return next(err)
  }
}

export const addStudent = async (req, res, next) => {
  try {
    const data = await studentService.createStudent(req.body)
    return success(res, data, '创建成功')
  } catch (err) {
    if (err?.code === '23505') return fail(res, '学号已存在', 409)
    return next(err)
  }
}

export const editStudent = async (req, res, next) => {
  try {
    const data = await studentService.updateStudentById(req.params.id, req.body)
    if (!data) return fail(res, '学生不存在', 404)
    return success(res, data, '更新成功')
  } catch (err) {
    if (err?.code === '23505') return fail(res, '学号已存在', 409)
    return next(err)
  }
}

export const removeStudent = async (req, res, next) => {
  try {
    const ok = await studentService.deleteStudentById(req.params.id)
    if (!ok) return fail(res, '学生不存在', 404)
    return success(res, true, '删除成功')
  } catch (err) {
    return next(err)
  }
}
