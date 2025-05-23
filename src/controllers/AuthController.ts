import { Request, Response } from 'express'
import {
    authService,
    CurrentUserPayload,
    EntityType,
} from '@/services/auth.service.js'
import { ForgotPassword } from '@/services/forgot-password.service.js'
import { z, ZodError } from 'zod'
import jwt from 'jsonwebtoken'
import { ResponseUtil } from '@/utils/response.util.js'
import {
    Admin,
    User,
    Teacher,
    Parent,
    Session,
    adminSchema,
    ownerSchema,
} from '@/models/index.js'
import { Op } from 'sequelize'

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    schoolCode: z.string().optional(),
    entityType: z.enum(['ADMIN', 'TEACHER', 'USER', 'PARENT']),
})

const forgotPasswordInitiateSchema = z.object({
    email: z.string().email(),
    entityType: z.enum(['STUDENT', 'ADMIN', 'TEACHER', 'PARENT', 'OWNER']),
})

const forgotPasswordResetSchema = z.object({
    otp: z.string().min(1, { message: 'OTP is required' }),
    newPassword: z
        .string()
        .min(6, { message: 'New password must be at least 6 characters long' }),
})

export const AuthController = {
    /**
     * Logs in a user, sets an auth cookie, and returns the result message based on session existence.
     */
    async login(req: Request, res: Response): Promise<void> {
        try {
            // Step 1: Validate incoming data
            const validatedData = loginSchema.parse(req.body)
            const { email, password, entityType } = validatedData

            // Step 2: Determine user model based on entityType
            const userModels: Record<
                string,
                typeof Admin | typeof Teacher | typeof User | typeof Parent
            > = {
                ADMIN: Admin,
                TEACHER: Teacher,
                USER: User,
                PARENT: Parent,
            }

            const userModel = userModels[entityType]
            if (!userModel) {
                res.status(400).json({ message: 'Invalid entity type' })
                return
            }

            // Step 3: Clear expired sessions
            await Session.destroy({
                where: {
                    expiryDate: { [Op.lt]: new Date() },
                },
            })

            // Step 4: Prepare metadata
            const userAgent = req.headers['user-agent'] || 'unknown'
            const ipAddress =
                req.headers['x-forwarded-for']?.toString().split(',')[0] ||
                req.socket.remoteAddress ||
                ''

            // Step 5: Attempt login
            const {
                token,
                message: loginMessage,
                success,
            } = await authService.login(
                email,
                password,
                entityType as EntityType,
                userModel,
                userAgent,
                ipAddress,
            )

            if (!success) {
                throw new Error(loginMessage)
            }

            // Step 6: Set secure HTTP-only cookie (configured per environment)
            const isProduction = process.env.NODE_ENV === 'production'

            res.cookie('token', token, {
                httpOnly: true,
                secure: isProduction, // must be true in production (over HTTPS)
                sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-site cookies
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: '/', // Optional: restrict path
            })

            // Step 7: Send successful response
            const response = ResponseUtil.success(loginMessage)
            res.status(200).json(response)
        } catch (error) {
            console.error('Login error:', error)

            if (error instanceof z.ZodError) {
                const response = ResponseUtil.error('Validation failed', 400)
                res.status(400).json(response)
                return
            }

            const response = ResponseUtil.error(
                error instanceof Error ? error.message : 'Something went wrong',
                500,
            )
            res.status(500).json(response)
        }
    },
    async studentLogin(req: Request, res: Response): Promise<void> {
        try {
            // Step 1: Validate incoming data
            const validatedData = loginSchema.parse(req.body)
            const { email, password, schoolCode } = validatedData

            // Step 3: Clear expired sessions
            await Session.destroy({
                where: {
                    expiryDate: { [Op.lt]: new Date() },
                },
            })

            // Step 4: Prepare metadata
            const userAgent = req.headers['user-agent'] || 'unknown'
            const ipAddress =
                req.headers['x-forwarded-for']?.toString().split(',')[0] ||
                req.socket.remoteAddress ||
                ''

            // Step 5: Attempt login
            const {
                token,
                message: loginMessage,
                success,
            } = await authService.userLogin({
                email,
                entityType: EntityType.USER,
                ipAddress,
                password,
                schoolCode: schoolCode!,
                userAgent,
            })

            if (!success) {
                throw new Error(loginMessage)
            }

            // Step 6: Set secure HTTP-only cookie (configured per environment)
            const isProduction = process.env.NODE_ENV === 'production'

            res.cookie('token', token, {
                httpOnly: true,
                secure: isProduction, // must be true in production (over HTTPS)
                sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-site cookies
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: '/', // Optional: restrict path
            })

            // Step 7: Send successful response
            const response = ResponseUtil.success(loginMessage)
            res.status(200).json(response)
        } catch (error) {
            console.error('Login error:', error)

            if (error instanceof z.ZodError) {
                const response = ResponseUtil.error('Validation failed', 400)
                res.status(400).json(response)
                return
            }

            const response = ResponseUtil.error(
                error instanceof Error ? error.message : 'Something went wrong',
                500,
            )
            res.status(500).json(response)
        }
    },
    async teacherLogin(req: Request, res: Response): Promise<void> {
        try {
            // Step 1: Validate incoming data
            const validatedData = loginSchema.parse(req.body)
            const { email, password, schoolCode } = validatedData

            // Step 3: Clear expired sessions
            await Session.destroy({
                where: {
                    expiryDate: { [Op.lt]: new Date() },
                },
            })

            // Step 4: Prepare metadata
            const userAgent = req.headers['user-agent'] || 'unknown'
            const ipAddress =
                req.headers['x-forwarded-for']?.toString().split(',')[0] ||
                req.socket.remoteAddress ||
                ''

            // Step 5: Attempt login
            const {
                token,
                message: loginMessage,
                success,
            } = await authService.userLogin({
                email,
                entityType: EntityType.TEACHER,
                ipAddress,
                password,
                schoolCode: schoolCode!,
                userAgent,
            })

            if (!success) {
                throw new Error(loginMessage)
            }

            // Step 6: Set secure HTTP-only cookie (configured per environment)
            const isProduction = process.env.NODE_ENV === 'production'

            res.cookie('token', token, {
                httpOnly: true,
                secure: isProduction, // must be true in production (over HTTPS)
                sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-site cookies
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: '/', // Optional: restrict path
            })

            // Step 7: Send successful response
            const response = ResponseUtil.success(loginMessage)
            res.status(200).json(response)
        } catch (error) {
            console.error('Login error:', error)

            if (error instanceof z.ZodError) {
                const response = ResponseUtil.error('Validation failed', 400)
                res.status(400).json(response)
                return
            }

            const response = ResponseUtil.error(
                error instanceof Error ? error.message : 'Something went wrong',
                500,
            )
            res.status(500).json(response)
        }
    },

    async ownerLogin(req: Request, res: Response): Promise<void> {
        try {
            // Validate request payload
            const validatedData = ownerSchema.parse(req.body)
            const { email, password } = validatedData

            // Delete any expired sessions securely.
            // Import Op from sequelize where needed (import { Op } from 'sequelize';)
            await Session.destroy({
                where: {
                    expiryDate: { [Op.lt]: new Date() },
                },
            })

            // Get other request parameters
            const userAgent = req.headers['user-agent']
            const ipAddress = req.ip

            // Capture both the token and the message returned by authService.login
            const {
                token,
                message: loginMessage,
                success,
            } = await authService.ownerLogin({
                email,
                password,
                ipAddress,
                userAgent,
            })

            // Set the token as an HTTP-only cookie (adjust secure flag according to your environment)
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })

            if (!success) {
                throw new Error(loginMessage)
            }

            // Return a successful response using the service-provided message
            const response = ResponseUtil.success(loginMessage)
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
    async signUp(req: Request, res: Response): Promise<void> {
        try {
            const { firstName, lastName, email, password, entityType } =
                adminSchema.parse(req.body)

            await authService.signUp({
                firstName,
                lastName,
                email,
                password,
                entityType,
            })

            const response = ResponseUtil.success(
                'Account created successfully',
            )
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(ResponseUtil.error(error.message, 400))
            } else if (error instanceof ZodError) {
                res.status(400).json(
                    ResponseUtil.error('Validation Error', 400),
                )
            }
        }
    },

    /**
     * Log out the user by invalidating the active session token.
     */
    async logout(req: Request, res: Response): Promise<void> {
        try {
            const token = req.cookies.token
            const userAgent = req.headers['user-agent']
            const isSessionExists = await Session.findOne({
                where: { token, userAgent },
            })
            const decodedToken = jwt.verify(
                token,
                process.env.JWT_SECRET as string,
            ) as CurrentUserPayload
            const userId = decodedToken.userId
            const entityType = decodedToken.entityType

            if (!isSessionExists) {
                res.status(404).json(
                    ResponseUtil.error('Session does not exist', 404),
                )
                return
            }
            await authService.logout(
                token,
                userId,
                entityType,
                userAgent as string,
            )
            const response = ResponseUtil.success('Logout successful')
            res.status(200).json(response)
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message, 400)
                res.status(400).json(response)
            }
        }
    },
    async logoutFromAllSessions(req: Request, res: Response): Promise<void> {
        try {
            const token = req.cookies.token

            const decodedToken = jwt.verify(
                token,
                process.env.JWT_SECRET as string,
            ) as CurrentUserPayload
            console.log(decodedToken)
            const userId = decodedToken.userId
            const entityType = decodedToken.entityType
            await Session.destroy({
                where: {
                    userId,
                    entityType,
                },
            })
            res.clearCookie('token')
            res.status(200).json(
                ResponseUtil.success(
                    'Logout successful from all sessions',
                    'Something went wrong',
                ),
            )
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                res.status(400).json(ResponseUtil.error('Logout failed', 400))
            }
        }
        // const session=await Session.findAll({where:toke})
    },
    /**
     * Initiates the forgot password process.
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
            console.log(`DEBUG [AUTH] RESET PASSWORD : ${error}`)
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
     * Resets the user's password using an OTP.
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

    /**
     * Verify session and return user data with role
     */
    async checkSession(req: Request, res: Response): Promise<void> {
        try {
            const token = req.cookies.token

            if (!token) {
                res.status(401).json(
                    ResponseUtil.error('No session found', 401),
                )
                return
            }
            console.log('session router')
            const { isValid, user, role } =
                await authService.verifySession(token)

            if (!isValid) {
                res.clearCookie('token') // Clear invalid/expired token
                res.status(401).json(ResponseUtil.error('Session expired', 401))
                return
            }

            // Return session data with role
            res.status(200).json(
                ResponseUtil.success({
                    user: user,
                    role: role,
                    isAuthenticated: true,
                }),
            )
        } catch {
            res.status(500).json(
                ResponseUtil.error('Session verification failed', 500),
            )
        }
    },
}
