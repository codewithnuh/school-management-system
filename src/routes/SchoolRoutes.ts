import { SchoolController } from '@/controllers/SchoolController.js'
import authWithRBAC from '@/middleware/auth.middleware'
import express from 'express'

const router = express.Router()

router.post('/', authWithRBAC(['OWNER']), SchoolController.createSchool)
// CORRECTED ROUTE DEFINITION:
router.get('/:id', authWithRBAC(['OWNER']), SchoolController.getSchoolById)
export default router
