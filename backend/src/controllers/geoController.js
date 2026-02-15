import { z } from 'zod'
import { success, fail } from '../middleware/response.js'
import * as geoService from '../services/geoService.js'

export const geoSchema = z.object({
  name: z.string().min(1, '地点名必填'),
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  polygonWkt: z.string().min(10, '请输入有效WKT')
})

export const getGeoItems = async (req, res, next) => {
  try {
    const data = await geoService.listGeoItems()
    return success(res, data)
  } catch (err) {
    return next(err)
  }
}

export const addGeoItem = async (req, res, next) => {
  try {
    const data = await geoService.createGeoItem(req.body)
    return success(res, data, '创建成功')
  } catch (err) {
    return next(err)
  }
}

export const editGeoItem = async (req, res, next) => {
  try {
    const data = await geoService.updateGeoItemById(req.params.id, req.body)
    if (!data) return fail(res, '地理数据不存在', 404)
    return success(res, data, '更新成功')
  } catch (err) {
    return next(err)
  }
}

export const removeGeoItem = async (req, res, next) => {
  try {
    const ok = await geoService.deleteGeoItemById(req.params.id)
    if (!ok) return fail(res, '地理数据不存在', 404)
    return success(res, true, '删除成功')
  } catch (err) {
    return next(err)
  }
}
