import { Request, Response } from 'express'
import { authService, EntityType } from '@/services/auth.service.js'
import { ForgotPassword } from '@/services/forgot-password.service'
import { z } from 'zod'
import { ResponseUtil } from '@/utils/response.util.js'
import { Admin, User, Teacher, Parent, Session } from '@/models/index.js'

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    entityType: z.enum(['ADMIN', 'TEACHER', 'USER', 'PARENT']),
})

const forgotPasswordInitiateSchema = z.object({
    email: z.string().email(),
    entityType: z.enum(['STUDENT', 'ADMIN', 'TEACHER', 'PARENT']),
})

const forgotPasswordResetSchema = z.object({
    otp: z.string().min(1, { message: 'OTP is required' }),
    newPassword: z
        .string()
        .min(6, { message: 'New password must be at least 6 characters long' }),
})

export const authController = {
    async login(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = loginSchema.parse(req.body)
            const { email, password, entityType } = validatedData

            let userModel
            switch (entityType) {
                case 'ADMIN':
                    userModel = Admin
                    break
                case 'TEACHER':
                    userModel = Teacher
                    break
                case 'USER':
                    userModel = User
                    break
                case 'PARENT':
                    userModel = Parent
                    break
                default:
                    res.status(400).json({ message: 'Invalid entity type' })
                    return
            }

            const userAgent = req.headers['user-agent']
            const ipAddress = req.ip

            const { token } = await authService.login(
                email,
                password,
                entityType as EntityType,
                userModel,
                userAgent,
                ipAddress,
            )
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'development',
                sameSite: 'strict',
                maxAge: 120 * 120 * 1000,
            })
            const response = ResponseUtil.success('Login successful')
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof z.ZodError) {
                const response = ResponseUtil.error('Validation error', 400)
                res.status(400).json(response)
                console.error(error)
                return
            }
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message, 400)
                res.status(500).json(response)
                console.error(error)
                return
            }
        }
    },

    async logout(req: Request, res: Response): Promise<void> {
        try {
            const token = req.cookies.token
            const isSessionExists = await Session.findOne({
                where: { token },
            })
            if (!isSessionExists) {
                res.status(404).json(
                    ResponseUtil.error('Session does not exist', 404),
                )
                return
            }
            await authService.logout(token)
            const response = ResponseUtil.success('Logout successful')
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message, 400)
                res.status(400).json(response)
            }
        }
    },

    /**
     * Initiates the forgot password process.
     * This endpoint verifies if the email exists for the specified entity type,
     * cleans up any previous OTPs, creates a new OTP, and sends it via email.
     */
    async forgotPasswordInitiate(req: Request, res: Response): Promise<void> {
        try {
            const { email, entityType } = forgotPasswordInitiateSchema.parse(
                req.body,
            )
            const result = await ForgotPassword.verifyEmailAndSendOTP({
                email,
                entityType,
            })
            const response = ResponseUtil.success(result.message)
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof z.ZodError) {
                const response = ResponseUtil.error('Validation error', 400)
                res.status(400).json(response)
                console.error(error)
                return
            }
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message, 400)
                res.status(400).json(response)
                console.error(error)
                return
            }
        }
    },

    /**
     * Resets the password using the OTP.
     * This endpoint expects a valid OTP and a new password.
     * It verifies the OTP (including expiration), then marks it as used,
     * hashes the new password, and updates the corresponding entity.
     */
    async forgotPasswordReset(req: Request, res: Response): Promise<void> {
        try {
            const { otp, newPassword } = forgotPasswordResetSchema.parse(
                req.body,
            )
            const result = await ForgotPassword.resetPassword(otp, newPassword)
            const response = ResponseUtil.success(result)
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof z.ZodError) {
                const response = ResponseUtil.error('Validation error', 400)
                res.status(400).json(response)
                console.error(error)
                return
            }
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message, 400)
                res.status(400).json(response)
                console.error(error)
                return
            }
        }
    },
}
