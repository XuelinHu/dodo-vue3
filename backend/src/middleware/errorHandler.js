import { fail } from './response.js'

export const errorHandler = (err, req, res, next) => {
  console.error(err)
  return fail(res, err.message || '服务器异常', err.status || 500)
}
