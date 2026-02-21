import { Router } from 'express'
import { validate } from '../middleware/validate.js'
import { addClass, classSchema, editClass, getClasses, removeClass } from '../controllers/classController.js'

const router = Router()

router.get('/', getClasses)
router.post('/', validate(classSchema), addClass)
router.put('/:id', validate(classSchema), editClass)
router.delete('/:id', removeClass)

export default router
