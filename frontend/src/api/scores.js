import http from './http'

export const listScores = async (params) => {
  return http.get('/scores', { params })
}

export const createScore = async (payload) => {
  return http.post('/scores', payload)
}

export const updateScore = async (id, payload) => {
  return http.put(`/scores/${id}`, payload)
}

export const deleteScore = async (id) => {
  return http.delete(`/scores/${id}`)
}

export const getSubjectStats = async () => {
  return http.get('/scores/stats/subjects')
}

