import { Router } from 'express'
import { validate } from '../middleware/validate.js'
import { addScore, editScore, getScoreStats, getScores, removeScore, scoreSchema } from '../controllers/scoreController.js'

const router = Router()

router.get('/', getScores)
router.get('/stats/subjects', getScoreStats)
router.post('/', validate(scoreSchema), addScore)
router.put('/:id', validate(scoreSchema), editScore)
router.delete('/:id', removeScore)

export default router
