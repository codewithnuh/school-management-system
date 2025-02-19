import express from 'express'
import { authController } from '@/controllers/AuthController.js'

const router = express.Router()

router.post('/login', authController.login)
router.post('/login', authController.logout)
router.post('/forgotPassword', authController.forgotPassword)

export default router
