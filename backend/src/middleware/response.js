export const success = (res, data, message = 'ok') => {
  return res.json({
    code: 0,
    message,
    data
  })
}

export const fail = (res, message = 'error', status = 400) => {
  return res.status(status).json({
    code: status,
    message,
    data: null
  })
}
