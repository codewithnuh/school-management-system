import { Router } from 'express'
import { RegistrationController } from '@/controllers/RegistrationController.js'
import authWithRBAC from '@/middleware/auth.middleware'

const router = Router()

// Protect routes with middleware if needed
router.post(
    '/teacher',
    authWithRBAC(['ADMIN']),
    RegistrationController.createTeacherRegistrationLink,
)

router.get(
    '/teacher',
    authWithRBAC(['ADMIN']),
    RegistrationController.getTeacherRegistrationLinks,
)
router.get(
    '/teacher',
    authWithRBAC(['ADMIN']),
    RegistrationController.getTeacherRegistrationLinkByAdminId,
)
router.delete(
    '/teacher',
    authWithRBAC(['ADMIN']),
    RegistrationController.deleteTeacherRegistrationLink,
)
router.delete(
    '/student',
    authWithRBAC(['ADMIN']),
    RegistrationController.deleteStudentRegistrationLink,
)
router.get(
    '/student/:id',
    authWithRBAC(['ADMIN']),
    RegistrationController.getStudentRegistrationLinkWithId,
)

router.post(
    '/student',
    authWithRBAC(['ADMIN']),
    RegistrationController.createStudentRegistrationLink,
)

router.get(
    '/student',
    authWithRBAC(['ADMIN']),
    RegistrationController.getStudentRegistrationLinks,
)

export default router
