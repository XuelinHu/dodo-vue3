import http from './http'

export const fetchGeoItems = () => http.get('/geo')
export const createGeoItem = (payload) => http.post('/geo', payload)
export const updateGeoItem = (id, payload) => http.put(`/geo/${id}`, payload)
export const deleteGeoItem = (id) => http.delete(`/geo/${id}`)
