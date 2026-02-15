import { fail } from './response.js'

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    return fail(res, result.error.issues.map((item) => item.message).join('; '), 422)
  }
  req.body = result.data
  return next()
}
