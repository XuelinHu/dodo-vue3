import { z } from 'zod'
import { success, fail } from '../middleware/response.js'
import * as userService from '../services/userService.js'

export const userSchema = z.object({
  name: z.string().min(1, '姓名必填'),
  age: z.number().int().min(0),
  salary: z.number().positive(),
  birthday: z.string().min(1),
  isActive: z.boolean()
})

export const getUsers = async (req, res, next) => {
  try {
    const data = await userService.listUsers()
    return success(res, data)
  } catch (err) {
    return next(err)
  }
}

export const addUser = async (req, res, next) => {
  try {
    const data = await userService.createUser(req.body)
    return success(res, data, '创建成功')
  } catch (err) {
    return next(err)
  }
}

export const editUser = async (req, res, next) => {
  try {
    const data = await userService.updateUserById(req.params.id, req.body)
    if (!data) return fail(res, '用户不存在', 404)
    return success(res, data, '更新成功')
  } catch (err) {
    return next(err)
  }
}

export const removeUser = async (req, res, next) => {
  try {
    const ok = await userService.deleteUserById(req.params.id)
    if (!ok) return fail(res, '用户不存在', 404)
    return success(res, true, '删除成功')
  } catch (err) {
    return next(err)
  }
}
