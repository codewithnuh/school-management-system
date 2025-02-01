import express from 'express'
import { ClassController } from '../controllers/ClassController'

const router = express.Router()
router.post('/', ClassController.createClass)
router.get('/', ClassController.getAllClasses)
router.get('/:id', ClassController.getClassById)
router.put('/:id', ClassController.updateClass)
router.delete('/:id', ClassController.deleteClass)

export default router
