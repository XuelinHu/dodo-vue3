import { Router } from 'express'
import { addUser, editUser, getUsers, removeUser, userSchema } from '../controllers/userController.js'
import { validate } from '../middleware/validate.js'

const router = Router()

router.get('/', getUsers)
router.post('/', validate(userSchema), addUser)
router.put('/:id', validate(userSchema), editUser)
router.delete('/:id', removeUser)

export default router
