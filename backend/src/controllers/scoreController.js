import { z } from 'zod'
import { success, fail } from '../middleware/response.js'
import { parsePagination } from '../utils/pagination.js'
import * as scoreService from '../services/scoreService.js'

export const scoreSchema = z.object({
  studentId: z.number().int(),
  subject: z.string().min(1, '科目必填'),
  score: z.number().min(0).max(150),
  examDate: z.string().min(1, '考试日期必填')
})

export const getScores = async (req, res, next) => {
  try {
    const { page, pageSize, offset, limit } = parsePagination(req.query)
    const keyword = (req.query.keyword || '').toString().trim()
    const subject = (req.query.subject || '').toString().trim()
    const data = await scoreService.listScores({ keyword, subject, offset, limit, page, pageSize })
    return success(res, data)
  } catch (err) {
    return next(err)
  }
}

export const addScore = async (req, res, next) => {
  try {
    const data = await scoreService.createScore(req.body)
    return success(res, data, '创建成功')
  } catch (err) {
    if (err?.code === '23505') return fail(res, '同一学生同一科目同一天成绩已存在', 409)
    if (err?.code === '23503') return fail(res, '学生不存在', 422)
    return next(err)
  }
}

export const editScore = async (req, res, next) => {
  try {
    const data = await scoreService.updateScoreById(req.params.id, req.body)
    if (!data) return fail(res, '成绩不存在', 404)
    return success(res, data, '更新成功')
  } catch (err) {
    if (err?.code === '23505') return fail(res, '同一学生同一科目同一天成绩已存在', 409)
    if (err?.code === '23503') return fail(res, '学生不存在', 422)
    return next(err)
  }
}

export const removeScore = async (req, res, next) => {
  try {
    const ok = await scoreService.deleteScoreById(req.params.id)
    if (!ok) return fail(res, '成绩不存在', 404)
    return success(res, true, '删除成功')
  } catch (err) {
    return next(err)
  }
}

export const getScoreStats = async (req, res, next) => {
  try {
    const data = await scoreService.getSubjectAvgStats()
    return success(res, data)
  } catch (err) {
    return next(err)
  }
}
