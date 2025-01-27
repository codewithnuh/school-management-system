import express from 'express'
import TeacherController from '@/controllers/TeacherController'

const router = express.Router()

router.get('/', TeacherController.getTeachers.bind)
router.post('/register', TeacherController.registerTeacher)
router.get('/:id', TeacherController.getTeacherById.bind)
router.post('/accept', TeacherController.acceptTeacherApplication)
router.post('/reject', TeacherController.rejectTeacherApplication)
router.post('/interview', TeacherController.interviewTeacherApplicant)

export default router
