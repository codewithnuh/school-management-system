import express from 'express'
import { authController } from '@/controllers/authController.js'

const router = express.Router()

// Login route
router.post('/login', authController.login)

// Logout route
router.post('/logout', authController.logout)

// Forgot password initiation route
router.post('/forgot-password/initiate', authController.forgotPasswordInitiate)

// Forgot password reset route
router.post('/forgot-password/reset', authController.forgotPasswordReset)

export default router
