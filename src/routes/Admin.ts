import { AdminController } from '@/controllers/AdminController.js'
import express from 'express'
const router = express.Router()

router.get('/', AdminController.getAllAdmins)
router.put('/', AdminController.updateAdminById)
router.get(
    '/verify-subscription/:adminId',
    AdminController.verifyAdminSubscriptionByAdminId,
)

export default router
