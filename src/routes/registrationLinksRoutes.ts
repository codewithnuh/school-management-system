import { Router } from 'express'
import { RegistrationController } from '@/controllers/RegistrationController.js'

const router = Router()

// Protect routes with middleware if needed
router.post('/teacher', RegistrationController.createTeacherRegistrationLink)

router.get('/teacher', RegistrationController.getTeacherRegistrationLinks)
router.get(
    '/teacher/:id',
    RegistrationController.getTeacherRegistrationLinkWithId,
)
router.delete('/teacher', RegistrationController.deleteTeacherRegistrationLink)
router.delete('/student', RegistrationController.deleteTeacherRegistrationLink)
router.get(
    '/student/:id',
    RegistrationController.getStudentRegistrationLinkWithId,
)

router.post('/student', RegistrationController.createStudentRegistrationLink)

router.get(
    '/student',

    RegistrationController.getStudentRegistrationLinks,
)

export default router
