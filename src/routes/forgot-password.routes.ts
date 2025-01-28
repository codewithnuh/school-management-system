import express from 'express'
import { ForgotPasswordController } from '@/controllers/forgot-password.controller'

const router = express.Router()

router.post('/initiate', ForgotPasswordController.initiatePasswordReset)
router.post('/verify-otp', ForgotPasswordController.verifyOTP)
router.post('/reset-password', ForgotPasswordController.resetPassword)

export default router