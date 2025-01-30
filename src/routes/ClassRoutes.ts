// routes/class.ts
import express from 'express'
import { ClassController } from '../controllers/ClassController'

const router = express.Router()

// Update periods per day for a class
router.put('/:classId/periods', ClassController.updatePeriodsPerDay)

// Get class details by ID
router.get('/:classId', ClassController.getClassById)

// Create a new class
router.post('/', ClassController.createClass)

export default router
