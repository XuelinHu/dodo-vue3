import http from './http'

export const fetchUsers = () => http.get('/users')
export const createUser = (payload) => http.post('/users', payload)
export const updateUser = (id, payload) => http.put(`/users/${id}`, payload)
export const deleteUser = (id) => http.delete(`/users/${id}`)
