import { Request, Response } from 'express'
import { User } from '@/models/User'
import { userSchema } from '@/schema/user.schema'
import { PasswordResetToken } from '@/models/PasswordResetToken'
import bcrypt from 'bcrypt'
import { createJWT } from '@/middleware/jwt'
import { Session } from '@/models/Session'
class UserController {
    public async createUser(req: Request, res: Response): Promise<void> {
        try {
            const {
                firstName,
                middleName,
                lastName,
                dateOfBirth,
                gender,
                placeOfBirth,
                nationality,
                email,
                phoneNo,
                emergencyContactName,
                emergencyContactNumber,
                address,
                studentId,
                previousSchool,
                previousGrade,
                previousMarks,
                isRegistered,
                guardianName,
                guardianCNIC,
                guardianPhone,
                guardianEmail,
                CNIC,
                class: userClass,
                enrollmentDate,
                uuid,
                medicalConditions,
                allergies,
                photo,

                transportation,
                extracurriculars,
                healthInsuranceInfo,
                doctorContact,
                password,
            } = req.body
            const userData = {
                firstName,
                middleName,
                lastName,
                dateOfBirth,
                gender,
                placeOfBirth,
                nationality,
                email,
                phoneNo,
                emergencyContactName,
                emergencyContactNumber,
                address,
                studentId,
                previousSchool,
                previousGrade,
                previousMarks,
                isRegistered,
                guardianName,
                guardianCNIC,
                guardianPhone,
                guardianEmail,
                CNIC,
                class: userClass,
                enrollmentDate,
                uuid,
                medicalConditions,
                allergies,
                photo,
                transportation,
                extracurriculars,
                healthInsuranceInfo,
                doctorContact,
                password,
            }
            const validatedUserData = userSchema.parse(userData)
            const user = await User.create(validatedUserData)

            res.json({
                user,
            })
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error })
            }
        }
    }

    public async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const allUsers = await User.findAll({
                where: {
                    isRegistered: true,
                },
            })
            res.json({
                users: allUsers,
            })
        } catch (error) {
            if (error instanceof Error) {
                res.json({
                    error: error.message,
                })
            }
        }
    }
    public async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const deltedUser = await User.drop({ cascade: true })
            res.json({
                data: this.deleteUser,
            })
        } catch (error) {
            if (error instanceof Error) {
                res.json({
                    err: error.message,
                })
            }
        }
    }
    public async resetUserPassword(req: Request, res: Response): Promise<void> {
        try {
            const token = req.params.token
            console.log(token)
            const passwordResetToken = await PasswordResetToken.findOne({
                where: {
                    token,
                },
            })
            if (!passwordResetToken) {
                throw new Error('No reset password token found')
            }
            const userId = passwordResetToken?.userId
            const { newPassword } = req.body

            if (!newPassword) {
                throw new Error('Please add new password')
            }
            const hashedPassword = bcrypt.hash(newPassword, 10)
            const user = await User.findByPk(userId)
            if (!user) {
                res.json({
                    success: false,
                    msg: 'No user found',
                })
            }
            // WIP : add logic if token expired
            // if(passwordResetToken?.expiryDate)
            await user!.update({
                password: await hashedPassword,
                isRegistered: true,
            })
            res.json({
                success: true,
                msg: 'User password successfully reset',
            })
        } catch (error) {
            if (error instanceof Error) {
                res.json({
                    err: [error.name, error.message],
                })
            }
        }
    }
    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                throw new Error('Missing Required fields')
            }
            const userExists = await User.findOne({
                where: {
                    email,
                },
            })
            if (!userExists) {
                res.status(404).json({
                    success: false,
                    msg: 'User not found',
                })
            }
            const isPasswordValid = bcrypt.compare(
                password,
                userExists!.password,
            )
            if (!isPasswordValid) {
                res.status(401).json({
                    success: false,
                    msg: 'Invalid email or password',
                })
            }
            const jwtToken = await createJWT({
                userId: userExists?.id,
            })

            // Store session in the database
            const expiresAt = new Date()
            expiresAt.setHours(expiresAt.getHours() + 1) // 1-hour expiry
            const isSessionExists = await Session.findOne({
                where: {
                    userId: userExists?.id,
                },
            })
            if (isSessionExists) {
                res.json({
                    success: false,
                    msg: 'Unable to create session, session already exists',
                })
            }
            const session = await Session.create({
                userId: userExists!.id,
                sessionId: jwtToken,
                expiresAt,
            })
            // Set cookie with session ID
            res.cookie('sessionId', session.sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'development',
                maxAge: 60 * 60 * 1000, // 1 hour
            })

            res.status(200).json({
                message: 'Signin successful',
                user: {
                    id: userExists!.id,
                    email: userExists!.email,
                    name: userExists!.firstName,
                },
            })
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    name: error.name,
                    msg: error.message,
                })
            }
        }
    }
}

export default new UserController()
