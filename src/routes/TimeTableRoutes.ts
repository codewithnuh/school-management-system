import express from 'express'
import { TimetableController } from '@/controllers/TimeTableController'

const router = express.Router()

router.post('/generate/:classid', TimetableController.generateTimetable)
router.get('/:classId/:sectionId', TimetableController.getTimetable)
export default router
