import { AdminController } from '@/controllers/AdminController.js'
import express from 'express'
const router = express.Router()

router.get('/', AdminController.getAllAdmins)
export default router
