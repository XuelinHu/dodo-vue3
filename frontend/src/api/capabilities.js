import http from './http'

export const getCapabilities = async () => {
  return http.get('/capabilities')
}

