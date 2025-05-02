import { AdminController } from '@/controllers/AdminController.js'
import express from 'express'
const router = express.Router()

router.get('/', AdminController.getAllAdmins)
router.put('/', AdminController.updateAdminById)
export default router
