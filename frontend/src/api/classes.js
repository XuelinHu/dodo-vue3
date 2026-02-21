import http from './http'

export const listClasses = async (params) => {
  return http.get('/classes', { params })
}

export const createClass = async (payload) => {
  return http.post('/classes', payload)
}

export const updateClass = async (id, payload) => {
  return http.put(`/classes/${id}`, payload)
}

export const deleteClass = async (id) => {
  return http.delete(`/classes/${id}`)
}

