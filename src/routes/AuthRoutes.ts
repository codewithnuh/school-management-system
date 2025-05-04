import express from 'express'
import { AuthController } from '@/controllers/AuthController.js'

const router = express.Router()

// Login route
router.post('/login', AuthController.login)
router.post('/logout-all-sessions', AuthController.logoutFromAllSessions)
router.post('/owner/login', AuthController.ownerLogin)
//Signup route
router.post('/sign-up', AuthController.signUp)
// Logout route
router.post('/logout', AuthController.logout)
router.get('/session', AuthController.checkSession)

// Forgot password initiation route
router.post('/forgot-password/initiate', AuthController.forgotPasswordInitiate)

// Forgot password reset route
router.post('/forgot-password/reset', AuthController.forgotPasswordReset)

export default router
