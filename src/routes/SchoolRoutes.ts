import { SchoolController } from '@/controllers/SchoolController.js'
import express from 'express'

const router = express.Router()

router.post('/', SchoolController.createSchool)

export default router
