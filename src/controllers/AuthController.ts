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
import { env } from '@/config/env.js'
import {
    AUTH_COOKIE_NAME,
    AUTH_COOKIE_OPTIONS,
    clearAuthCookie,
} from '@/config/auth-cookie.js'
import { sessionStore } from '@/services/session-store.service.js'

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

function respondToAuthenticationFailure(error: unknown, response: Response): void {
    if (error instanceof ZodError) {
        response.status(400).json(ResponseUtil.error('Validation failed', 400))
        return
    }

    const message = error instanceof Error ? error.message.toLowerCase() : ''
    if (
        message.includes('invalid credential') ||
        message.includes('wrong password') ||
        message.includes('owner not found')
    ) {
        response.status(401).json(ResponseUtil.error('Invalid email or password', 401))
        return
    }

    console.error('Authentication request failed', error)
    response.status(500).json(ResponseUtil.error('Authentication failed', 500))
}

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
            res.cookie(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS)

            // Step 7: Send successful response
            const response = ResponseUtil.success(loginMessage)
            res.status(200).json(response)
        } catch (error) {
            respondToAuthenticationFailure(error, res)
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
            res.cookie(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS)

            // Step 7: Send successful response
            const response = ResponseUtil.success(loginMessage)
            res.status(200).json(response)
        } catch (error) {
            respondToAuthenticationFailure(error, res)
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
            res.cookie(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS)

            // Step 7: Send successful response
            const response = ResponseUtil.success(loginMessage)
            res.status(200).json(response)
        } catch (error) {
            respondToAuthenticationFailure(error, res)
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
            res.cookie(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS)

            if (!success) {
                throw new Error(loginMessage)
            }

            // Return a successful response using the service-provided message
            const response = ResponseUtil.success(loginMessage)
            res.status(200).json(response)
        } catch (error) {
            respondToAuthenticationFailure(error, res)
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
            const token = req.cookies?.[AUTH_COOKIE_NAME]
            if (!token) {
                res.status(401).json(ResponseUtil.error('No session found', 401))
                return
            }
            const userAgent = req.headers['user-agent'] ?? 'unknown'
            const isSessionExists = await sessionStore.findByToken(token)
            const decodedToken = jwt.verify(
                token,
                env.JWT_SECRET,
                { algorithms: ['HS256'] },
            ) as CurrentUserPayload
            const userId = decodedToken.userId
            const entityType = decodedToken.entityType

            if (
                !isSessionExists ||
                isSessionExists.userId !== userId ||
                isSessionExists.entityType !== entityType ||
                isSessionExists.expiryDate <= new Date()
            ) {
                res.status(401).json(ResponseUtil.error('Invalid or expired session', 401))
                return
            }
            await authService.logout(
                token,
                userId,
                entityType,
                userAgent,
            )
            const response = ResponseUtil.success('Logout successful')
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json(ResponseUtil.error('Invalid or expired session', 401))
                return
            }
            console.error('Logout request failed', error)
            res.status(500).json(ResponseUtil.error('Logout failed', 500))
        }
    },
    async logoutFromAllSessions(req: Request, res: Response): Promise<void> {
        try {
            const token = req.cookies?.[AUTH_COOKIE_NAME]
            if (!token) {
                res.status(401).json(ResponseUtil.error('No session found', 401))
                return
            }

            const decodedToken = jwt.verify(
                token,
                env.JWT_SECRET,
                { algorithms: ['HS256'] },
            ) as CurrentUserPayload
            const activeSession = await sessionStore.findByToken(token)
            if (
                !activeSession ||
                activeSession.expiryDate <= new Date() ||
                activeSession.userId !== decodedToken.userId ||
                activeSession.entityType !== decodedToken.entityType
            ) {
                res.status(401).json(ResponseUtil.error('Invalid or expired session', 401))
                return
            }
            const userId = decodedToken.userId
            const entityType = decodedToken.entityType
            await sessionStore.deleteByCriteria({
                userId,
                entityType,
            })
            clearAuthCookie(res)
            res.status(200).json(
                ResponseUtil.success(
                    'Logout successful from all sessions',
                    'Something went wrong',
                ),
            )
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json(ResponseUtil.error('Invalid or expired session', 401))
                return
            }
            console.error('Logout all sessions request failed', error)
            res.status(500).json(ResponseUtil.error('Logout failed', 500))
        }
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
                clearAuthCookie(res)
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
