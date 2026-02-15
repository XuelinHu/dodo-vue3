import { Router } from 'express'
import { addGeoItem, editGeoItem, geoSchema, getGeoItems, removeGeoItem } from '../controllers/geoController.js'
import { validate } from '../middleware/validate.js'

const router = Router()

router.get('/', getGeoItems)
router.post('/', validate(geoSchema), addGeoItem)
router.put('/:id', validate(geoSchema), editGeoItem)
router.delete('/:id', removeGeoItem)

export default router
