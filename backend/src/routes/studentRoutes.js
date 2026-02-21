import { Router } from 'express'
import { validate } from '../middleware/validate.js'
import { addStudent, editStudent, getStudents, removeStudent, studentSchema } from '../controllers/studentController.js'

const router = Router()

router.get('/', getStudents)
router.post('/', validate(studentSchema), addStudent)
router.put('/:id', validate(studentSchema), editStudent)
router.delete('/:id', removeStudent)

export default router
