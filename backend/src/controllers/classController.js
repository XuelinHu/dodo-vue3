import { z } from 'zod'
import { success, fail } from '../middleware/response.js'
import { parsePagination } from '../utils/pagination.js'
import * as classService from '../services/classService.js'

export const classSchema = z.object({
  name: z.string().min(1, '班级名称必填'),
  grade: z.number().int().min(1900).max(3000)
})

export const getClasses = async (req, res, next) => {
  try {
    const { page, pageSize, offset, limit } = parsePagination(req.query)
    const keyword = (req.query.keyword || '').toString().trim()
    const data = await classService.listClasses({ keyword, offset, limit, page, pageSize })
    return success(res, data)
  } catch (err) {
    return next(err)
  }
}

export const addClass = async (req, res, next) => {
  try {
    const data = await classService.createClass(req.body)
    return success(res, data, '创建成功')
  } catch (err) {
    if (err?.code === '23505') return fail(res, '班级已存在', 409)
    return next(err)
  }
}

export const editClass = async (req, res, next) => {
  try {
    const data = await classService.updateClassById(req.params.id, req.body)
    if (!data) return fail(res, '班级不存在', 404)
    return success(res, data, '更新成功')
  } catch (err) {
    if (err?.code === '23505') return fail(res, '班级已存在', 409)
    return next(err)
  }
}

export const removeClass = async (req, res, next) => {
  try {
    const ok = await classService.deleteClassById(req.params.id)
    if (!ok) return fail(res, '班级不存在', 404)
    return success(res, true, '删除成功')
  } catch (err) {
    return next(err)
  }
}
