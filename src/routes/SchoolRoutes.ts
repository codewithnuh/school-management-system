import { SchoolController } from '@/controllers/SchoolController.js'
import express from 'express'

const router = express.Router()

router.post('/', SchoolController.createSchool)
// CORRECTED ROUTE DEFINITION:
router.get('/:id', SchoolController.getSchoolById)
export default router
