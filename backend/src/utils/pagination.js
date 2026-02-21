export const parsePagination = (query) => {
  const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1)
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(query.pageSize ?? '10', 10) || 10))
  const offset = (page - 1) * pageSize
  return { page, pageSize, offset, limit: pageSize }
}
