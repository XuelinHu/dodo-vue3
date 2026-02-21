import http from './http'

export const listStudents = async (params) => {
  return http.get('/students', { params })
}

export const createStudent = async (payload) => {
  return http.post('/students', payload)
}

export const updateStudent = async (id, payload) => {
  return http.put(`/students/${id}`, payload)
}

export const deleteStudent = async (id) => {
  return http.delete(`/students/${id}`)
}

