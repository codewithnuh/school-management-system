import { Request, Response } from 'express'
import { authService, EntityType } from '@/services/auth.service.js'
import { z } from 'zod'
import { ResponseUtil } from '@/utils/response.util.js'
import { Admin, User, Teacher, Parent, Session } from '@/models/index.js'
import { ForgotPassword } from '@/services/forgot-password.service'
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    entityType: z.enum(['ADMIN', 'TEACHER', 'USER', 'PARENT']),
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
                // WIP - use env to production
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
                console.log(error)

                return
            }
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message, 400)
                res.status(500).json(response)
                console.log(error)
                return
            }
        }
    },
    async logout(req: Request, res: Response): Promise<void> {
        const token = req.cookies.token
        const isSessionExists = await Session.findOne({
            where: {
                token,
            },
        })
        if (!isSessionExists) res.status(404).json('Session does not exists')

        await authService.logout(token)
        const response = ResponseUtil.success('Logout successful')
        res.status(200).json(response)
    },
    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const { entityType, email, newPassword, otp } = req.body

            if (!entityType || !email)
                throw new Error('Email or entityType is missing')
            await ForgotPassword.sendForgotPasswordOTP({ entityType, email })
            await ForgotPassword.resetPassword(otp, newPassword)
            const response = ResponseUtil.success(
                'Password updated successfully',
            )
            // WIP - set correct status code
            res.status(201).json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(
                    `${error.message} ${error.stack}`,
                )
                res.status(400).json(response)
            }
        }
    },
}
