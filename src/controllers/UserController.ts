import { Request, Response } from 'express'
import { User } from '@/models/User'
import { userSchema } from '@/schema/user.schema'
import { PasswordResetToken } from '@/models/PasswordResetToken'
import bcrypt from 'bcrypt'
import { createJWT } from '@/utils/jwt'
import { Session } from '@/models/Session'
import { acceptStudentApplication } from '@/services/application.service'
import { ResponseUtil } from '@/utils/response.util'
import { sendForgotPasswordOTP } from '@/services/forgot-password.service'
import { OTP } from '@/models/OTP'
import { rmSync } from 'fs'
interface UserData {
    firstName: string
    middleName?: string
    lastName: string
    dateOfBirth: Date
    gender: string
    placeOfBirth: string
    nationality: string
    email: string
    phoneNo: string
    emergencyContactName: string
    emergencyContactNumber: string
    address: string
    studentId: string
    previousSchool?: string
    previousGrade?: string
    previousMarks?: number
    isRegistered: boolean
    guardianName: string
    guardianCNIC: string
    guardianPhone: string
    guardianEmail: string
    CNIC: string
    class: string
    enrollmentDate: Date
    uuid: string
    medicalConditions?: string
    allergies?: string
    photo?: string
    transportation?: string
    extracurriculars?: string
    healthInsuranceInfo?: string
    doctorContact?: string
    password?: string
}

class UserController {
    private static readonly SALT_ROUNDS = 10
    private static readonly SESSION_EXPIRY_HOURS = 1

    public createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userData: UserData = req.body
            const validatedUserData = userSchema.parse(userData)

            // Create user in a transaction
            const user = await User.sequelize?.transaction(async t => {
                return await User.create(validatedUserData, { transaction: t })
            })

            const response = ResponseUtil.success(
                user,
                'User created successfully',
                201,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            this.handleError(res, error)
        }
    }

    public getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const allUsers = await User.findAll({
                where: { isRegistered: true },
                attributes: { exclude: ['password'] }, // Don't send password in response
            })

            if (!allUsers.length) {
                res.status(404).json({
                    success: false,
                    message: 'No users found',
                })
                return
            }

            res.status(200).json({
                success: true,
                data: allUsers,
                message: 'Users retrieved successfully',
            })
        } catch (error) {
            this.handleError(res, error)
        }
    }

    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params

            if (!userId) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required',
                })
                return
            }

            const deletedUser = await User.destroy({
                where: { id: userId },
            })

            if (!deletedUser) {
                res.status(404).json({
                    success: false,
                    message: 'User not found',
                })
                return
            }

            res.status(200).json({
                success: true,
                message: 'User deleted successfully',
            })
        } catch (error) {
            this.handleError(res, error)
        }
    }

    public resetUserPassword = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        try {
            const token = req.query.token
            if (!token) {
                res.status(400).json({
                    success: false,
                    message: 'Reset token is required',
                })
                return
            }
            const { newPassword } = req.body

            if (!newPassword) {
                res.status(400).json({
                    success: false,
                    message: 'New password is required',
                })
                return
            }

            const passwordResetToken = await PasswordResetToken.findOne({
                where: { token: !token }, // Fixed the condition here
            })

            if (!passwordResetToken) {
                res.status(404).json({
                    success: false,
                    message: 'Invalid or expired reset token',
                })
                return
            }

            // Check if token is expired
            if (new Date() > passwordResetToken.expiresDate) {
                await passwordResetToken.destroy()
                const response = ResponseUtil.error(
                    'Reset token has expired',
                    400,
                )
                res.status(response.statusCode).json(response)
                return
            }

            const user = await User.findByPk(passwordResetToken.entityId)
            if (!user) {
                const response = ResponseUtil.error('User not found', 404)
                res.status(response.statusCode).json(response)
                return
            }

            const hashedPassword = await bcrypt.hash(
                newPassword,
                UserController.SALT_ROUNDS,
            )
            await user.update({
                password: hashedPassword,
                isRegistered: true,
            })

            // Delete the used token
            await passwordResetToken.destroy()

            res.status(200).json({
                success: true,
                message: 'Password reset successful',
            })
        } catch (error) {
            this.handleError(res, error)
        }
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                const response = ResponseUtil.error(
                    'Email and password are required',
                    400,
                )
                res.status(response.statusCode).json(response)
                return
            }

            const user = await User.findOne({
                where: { email },
            })

            if (!user) {
                const response = ResponseUtil.error('Invalid credentials', 401)
                res.status(response.statusCode).json(response)
                return
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password,
            )
            if (!isPasswordValid) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid credentials',
                })
                return
            }

            // Clear any existing sessions
            await Session.destroy({
                where: { userId: user.id },
            })

            const jwtToken = await createJWT({ userId: user.id })

            // Create new session
            const expiresAt = new Date()
            expiresAt.setHours(
                expiresAt.getHours() + UserController.SESSION_EXPIRY_HOURS,
            )

            const session = await Session.create({
                userId: user.id,
                sessionId: jwtToken,
                expiresAt,
            })

            res.cookie('sessionId', session.sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: UserController.SESSION_EXPIRY_HOURS * 60 * 60 * 1000,
                sameSite: 'strict',
            })

            const response = ResponseUtil.success(
                {
                    id: user.id,
                    email: user.email,
                    name: user.firstName,
                },
                'Login successful',
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            this.handleError(res, error)
        }
    }
    public acceptUserApplication = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const userId = req.query.id
        if (userId === undefined || isNaN(Number(userId))) {
            // Handle invalid or missing userId
            res.status(400).json({ error: 'Invalid or missing user ID' })
            return
        }
        const numericUserId = Number(userId)
        try {
            await acceptStudentApplication(numericUserId)

            res.status(200).json({
                success: true,
                message: 'User registered successfully',
            })
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    stack: error.message,
                })
            }
        }
    }
    public forgotPassword = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const { email, newPassword, otp, step } = req.body

        const user = await User.findOne({ where: { email } })
        try {
            switch (step) {
                case 'verifyEmail':
                    if (!email) {
                        const response = ResponseUtil.error(
                            'Email missing',
                            400,
                            'Please provide an email address',
                        )
                        res.status(400).json(response)
                        return
                    }

                    if (!user) {
                        const response = ResponseUtil.error(
                            'User not found',
                            404,
                            'No user registered with this email',
                        )
                        res.status(404).json(response)
                        return
                    }

                    await sendForgotPasswordOTP({
                        email,
                        entityType: 'STUDENT',
                    })

                    const response = ResponseUtil.success(
                        'OTP sent',

                        'An OTP has been sent to your email',
                        200,
                    )

                    res.status(200).json(response)

                    break

                case 'verifyOtp':
                    if (!email || !otp) {
                        const response = ResponseUtil.error(
                            'Email or OTP missing',
                            400,
                            'Please provide both email and OTP',
                        )
                        res.status(400).json(response)
                        return
                    }

                    const validOtp = await OTP.findValidOTP(
                        otp,
                        user!.id as number,
                        'STUDENT',
                    )
                    if (!validOtp) {
                        const response = ResponseUtil.error(
                            'Invalid OTP',
                            400,
                            'The provided OTP is invalid or has expired',
                        )
                        res.status(400).json(response)
                        return
                    }

                    const otpResponse = ResponseUtil.success(
                        'OTP verified',
                        'The OTP has been verified successfully',
                        200,
                    )
                    res.status(200).json(otpResponse)
                    break

                case 'resetPassword':
                    if (!email || !newPassword || !otp) {
                        const response = ResponseUtil.error(
                            'Email, OTP, or new password missing',
                            400,
                            'Please provide email, OTP, and new password',
                        )
                        res.status(400).json(response)
                        return
                    }

                    const isValidOtp = await OTP.findValidOTP(
                        otp,
                        user!.id as number,
                        'STUDENT',
                    )
                    if (!isValidOtp) {
                        const response = ResponseUtil.error(
                            'Invalid OTP',
                            400,
                            'The provided OTP is invalid or has expired',
                        )
                        res.status(400).json(response)
                        return
                    }

                    const userToUpdate = await User.findOne({
                        where: { email },
                    })
                    if (!userToUpdate) {
                        const response = ResponseUtil.error(
                            'User not found',
                            404,
                            'No user registered with this email',
                        )
                        res.status(404).json(response)
                        return
                    }

                    const newHashedPassword = await bcrypt.hash(newPassword, 10)
                    await userToUpdate.update({ password: newHashedPassword })

                    // Optionally, destroy the OTP after successful password reset
                    await OTP.destroy({ where: { otp, entityType: 'STUDENT' } })

                    const resetResponse = ResponseUtil.success(
                        'Password reset successful',
                        'Your password has been reset successfully',
                        200,
                    )
                    res.status(200).json(resetResponse)
                    break

                default:
                    const defaultResponse = ResponseUtil.error(
                        'Invalid step',
                        400,
                        'The provided step is invalid',
                    )
                    res.status(400).json(defaultResponse)
                    break
            }
        } catch (error) {
            const response = ResponseUtil.error(
                'Internal Server Error',
                500,
                'Internal Server Error',
            )
            res.status(500).json(response)
            return
        }
    }
    public logout = async (req: Request, res: Response): Promise<void> => {
        try {
            const sessionId = req.cookies.sessionId

            if (!sessionId) {
                res.status(400).json({
                    success: false,
                    message: 'No active session',
                })
                return
            }

            await Session.destroy({
                where: { sessionId },
            })

            res.clearCookie('sessionId')

            res.status(200).json({
                success: true,
                message: 'Logout successful',
            })
        } catch (error) {
            this.handleError(res, error)
        }
    }

    private handleError = (res: Response, error: unknown): void => {
        if (error instanceof Error) {
            const statusCode = this.getErrorStatusCode(error)
            const response = ResponseUtil.error(error.message, statusCode)
            res.status(response.statusCode).json(response)
        } else {
            const response = ResponseUtil.error(
                'An unexpected error occurred',
                500,
            )
            res.status(response.statusCode).json(response)
        }
    }

    private getErrorStatusCode = (error: Error): number => {
        switch (error.name) {
            case 'ValidationError':
                return 400
            case 'UnauthorizedError':
                return 401
            case 'ForbiddenError':
                return 403
            case 'NotFoundError':
                return 404
            default:
                return 500
        }
    }
}

export default new UserController()
