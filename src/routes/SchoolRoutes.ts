import { SchoolController } from '@/controllers/SchoolController.js'
import authWithRBAC from '@/middleware/auth.middleware'
import express from 'express'

const router = express.Router()

router.post('/', authWithRBAC(['ADMIN'], true), SchoolController.createSchool)
router.get(
    '/schoolId/:id',
    authWithRBAC(['ADMIN']),
    SchoolController.getSchoolById,
)
// CORRECTED ROUTE DEFINITION:
// router.get('/:id', authWithRBAC(['OWNER']), SchoolController.getSchoolById)
router.get(
    '/:adminId',
    authWithRBAC(['ADMIN']),
    SchoolController.getSchoolByAdminId,
)
export default router
