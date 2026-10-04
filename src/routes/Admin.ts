import { AdminController } from '@/controllers/AdminController.js'
import authWithRBAC from '@/middleware/auth.middleware.js'
import express from 'express'
const router = express.Router()

router.get('/', authWithRBAC(['OWNER']), AdminController.getAllAdmins)
router.put('/', authWithRBAC(['OWNER']), AdminController.updateAdminById)
router.get(
    '/verify-subscription/:adminId',
    authWithRBAC(['OWNER']),
    AdminController.verifyAdminSubscriptionByAdminId,
)

export default router
