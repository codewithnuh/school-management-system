import express from 'express'
import { AuthController } from '@/controllers/AuthController.js'
import {
    loginLimiter,
    registrationLimiter,
    sensitiveOperationLimiter,
} from '@/middleware/rateLimit.middleware.js'

const router = express.Router()

// Login route
router.post('/login', loginLimiter, AuthController.login)
router.post('/login/student', loginLimiter, AuthController.studentLogin)
router.post('/login/teacher', loginLimiter, AuthController.teacherLogin)
router.post('/logout-all-sessions', AuthController.logoutFromAllSessions)
router.post('/owner/login', loginLimiter, AuthController.ownerLogin)
//Signup route
router.post('/sign-up', registrationLimiter, AuthController.signUp)
// Logout route
router.post('/logout', AuthController.logout)
router.get('/session', AuthController.checkSession)

// Forgot password initiation route
router.post(
    '/forgot-password/initiate',
    sensitiveOperationLimiter,
    AuthController.forgotPasswordInitiate,
)

// Forgot password reset route
// Consider if sensitiveOperationLimiter is also needed here, or if the token itself is the primary protection
router.post('/forgot-password/reset', AuthController.forgotPasswordReset)

export default router
