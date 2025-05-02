import { Request, Response } from 'express'
import { User } from '@/models/User.js'
import { userSchema } from '@/schema/user.schema.js'
import { PasswordResetToken } from '@/models/PasswordResetToken.js'
import bcrypt from 'bcryptjs'

import { acceptStudentApplication } from '@/services/application.service.js'
import { ResponseUtil } from '@/utils/response.util.js'
import { logger } from '@/middleware/loggin.middleware.js'
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
    sectionId: number | null
}

class UserController {
    private static readonly SALT_ROUNDS = 10
    private static readonly SESSION_EXPIRY_HOURS = 1

    public createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userData: UserData = req.body
            userData.isRegistered = false
            userData.sectionId = null
            const validatedUserData = userSchema.parse(userData)

            // Create user in a transaction
            const user = await User.sequelize?.transaction(async t => {
                return await User.create(
                    {
                        ...validatedUserData,
                        password: await bcrypt.hash(
                            validatedUserData.password as string,
                            10,
                        ),
                    },
                    { transaction: t },
                )
            })

            const response = ResponseUtil.success(
                user,
                'User created successfully',
                201,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof Error) logger.error(error.message)
            this.handleError(res, error)
        }
    }

    public getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const allUsers = await User.findAll({
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
    public getAllVerfiedUsers = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
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
    public updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params
            console.log(id)
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required',
                })
                return
            }

            const user = await User.findByPk(Number(id))
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found',
                })
                return
            }

            // Exclude password updates here for security, unless you want to allow it
            const updateData = { ...req.body }
            delete updateData.password

            await user.update(updateData)

            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: user,
            })
        } catch (error) {
            console.log(error)
            this.handleError(res, error)
        }
    }
    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params
            console.log(userId)

            if (!userId) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required',
                })
                return
            }
            // WIP - check weather who is performing this action is authorized
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

    // public login = async (req: Request, res: Response): Promise<void> => {
    //     try {
    //         const { email, password } = req.body

    //         if (!email || !password) {
    //             const response = ResponseUtil.error(
    //                 'Email and password are required',
    //                 400,
    //             )
    //             res.status(response.statusCode).json(response)
    //             return
    //         }

    //         const user = await User.findOne({
    //             where: { email },
    //         })

    //         if (!user) {
    //             const response = ResponseUtil.error('Invalid credentials', 401)
    //             res.status(response.statusCode).json(response)
    //             return
    //         }

    //         const isPasswordValid = await bcrypt.compare(
    //             password,
    //             user.password,
    //         )
    //         if (!isPasswordValid) {
    //             res.status(401).json({
    //                 success: false,
    //                 message: 'Invalid credentials',
    //             })
    //             return
    //         }

    //         // Clear any existing sessions
    //         await Session.destroy({
    //             where: { userId: user.id },
    //         })

    //         const jwtToken = await createJWT({ userId: user.id })

    //         // Create new session
    //         const expiresAt = new Date()
    //         expiresAt.setHours(
    //             expiresAt.getHours() + UserController.SESSION_EXPIRY_HOURS,
    //         )

    //         const session = await Session.create({
    //             userId: user.id,
    //             sessionId: jwtToken,
    //             expiresAt,
    //         })

    //         res.cookie('sessionId', session.sessionId, {
    //             httpOnly: true,
    //             secure: process.env.NODE_ENV === 'production',
    //             maxAge: UserController.SESSION_EXPIRY_HOURS * 60 * 60 * 1000,
    //             sameSite: 'strict',
    //         })

    //         const response = ResponseUtil.success(
    //             {
    //                 id: user.id,
    //                 email: user.email,
    //                 name: user.firstName,
    //             },
    //             'Login successful',
    //         )
    //         res.status(response.statusCode).json(response)
    //     } catch (error) {
    //         this.handleError(res, error)
    //     }
    // }
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
    /**
     * Get all students who are not registered yet (pending applications)
     */
    public getUnregisteredStudents = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10
            const offset = (page - 1) * limit

            const unregisteredStudents = await User.findAndCountAll({
                where: {
                    isRegistered: false,
                },
                limit,
                offset,
                attributes: {
                    exclude: ['verificationDocument', 'password'],
                },
                order: [['createdAt', 'DESC']], // Most recent applications first
            })

            const response = ResponseUtil.paginated(
                unregisteredStudents.rows,
                unregisteredStudents.count,
                page,
                limit,
                'Unregistered students retrieved successfully',
            )

            res.status(response.statusCode).json(response)
            return
        } catch (error) {
            logger.error('Error fetching unregistered students', {
                error: error instanceof Error ? error.message : 'Unknown error',
            })

            const response = ResponseUtil.error('Internal server error', 500)
            res.status(response.statusCode).json(response)
            return
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
