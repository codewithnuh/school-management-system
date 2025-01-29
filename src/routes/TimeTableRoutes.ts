// routes/timetable.ts
import express from 'express'
import { TimetableController } from '@/controllers/TimeTableController'

const router = express.Router()

// Generate timetable for a section
router.post('/generate', TimetableController.generateTimetable)

// Get timetable for a section
router.get('/section/:sectionId', TimetableController.getSectionTimetable)

// Get timetable for a teacher
router.get('/teacher/:teacherId', TimetableController.getTeacherTimetable)

export default router
