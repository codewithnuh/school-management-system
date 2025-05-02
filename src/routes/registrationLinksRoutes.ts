import { Router } from 'express'
import { RegistrationController } from '@/controllers/RegistrationController.js'

const router = Router()

// Protect routes with middleware if needed
router.post(
    '/registration-link/teacher',
    RegistrationController.createTeacherRegistrationLink,
)

router.get('/teacher', RegistrationController.getTeacherRegistrationLinks)

router.post('/student', RegistrationController.createStudentRegistrationLink)

router.get(
    '/student',

    RegistrationController.getStudentRegistrationLinks,
)

export default router
