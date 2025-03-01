import express from 'express'
import { AuthController } from '@/controllers/AuthController.js'

const router = express.Router()

// Login route
router.post('/login', AuthController.login)

// Logout route
router.post('/logout', AuthController.logout)
router.get('/session', AuthController.checkSession)

// Forgot password initiation route
router.post('/forgot-password/initiate', AuthController.forgotPasswordInitiate)

// Forgot password reset route
router.post('/forgot-password/reset', AuthController.forgotPasswordReset)

export default router
