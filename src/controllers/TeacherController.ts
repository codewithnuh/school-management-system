// controllers/teacher.controller.ts
import { Request, Response } from 'express'
import { Teacher } from '../models/Teacher'
import { teacherSchema } from '@/schema/teacher.schema'
import { logger } from '@/middleware/loggin.middleware'
import { Op } from 'sequelize'

export class TeacherController {
    /**
     * Register a new teacher
     */
    public async registerTeacher(req: Request, res: Response) {
        try {
            // Validate request body against schema
            const validatedData = teacherSchema.parse(req.body)

            // Check if teacher already exists with same email or CNIC
            const existingTeacher = await Teacher.findOne({
                where: {
                    [Op.or]: [
                        { email: validatedData.email },
                        { cnic: validatedData.cnic },
                    ],
                },
            })

            if (existingTeacher) {
                logger.warn('Teacher registration failed - duplicate entry', {
                    email: validatedData.email,
                    cnic: validatedData.cnic,
                })
                return res.status(409).json({
                    status: 'error',
                    message: 'Teacher with this email or CNIC already exists',
                })
            }

            // Process file uploads if any
            // const photoPath = req.file?.path // Assuming you're using multer for file uploads
            const documents = {
                photo: 'https:google.com',
                cvPath: 'https:google.com',
                verificationDocument: 'https:google.com',
            }

            // Create new teacher
            const teacher = await Teacher.create({
                ...validatedData,
                ...documents,
                isVerified: false, // New teachers start unverified
                role: 'TEACHER',
            })

            // Remove sensitive information before sending response
            const { cvPath, verificationDocument, ...teacherData } =
                teacher.toJSON()

            logger.info('New teacher registered successfully', {
                teacherId: teacher.id,
                email: teacher.email,
            })

            return res.status(201).json({
                status: 'success',
                message: 'Teacher registered successfully',
                data: teacherData,
            })
        } catch (error) {
            logger.error('Teacher registration failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            })
            if (error instanceof Error) {
                if (error.name === 'ZodError') {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Validation failed',
                        errors: error.stack,
                    })
                }
            }

            return res.status(500).json({
                status: 'error',
                message: 'Internal server error',
            })
        }
    }

    /**
     * Get all teachers with pagination
     */
    public async getTeachers(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10
            const offset = (page - 1) * limit

            const teachers = await Teacher.findAndCountAll({
                limit,
                offset,
                attributes: {
                    exclude: ['cvPath', 'verificationDocument'],
                },
            })

            return res.status(200).json({
                status: 'success',
                data: {
                    teachers: teachers.rows,
                    total: teachers.count,
                    currentPage: page,
                    totalPages: Math.ceil(teachers.count / limit),
                },
            })
        } catch (error) {
            logger.error('Error fetching teachers', {
                error: error instanceof Error ? error.message : 'Unknown error',
            })

            return res.status(500).json({
                status: 'error',
                message: 'Internal server error',
            })
        }
    }

    /**
     * Get teacher by ID
     */
    public async getTeacherById(req: Request, res: Response) {
        try {
            const { id } = req.params

            const teacher = await Teacher.findByPk(id, {
                attributes: {
                    exclude: ['cvPath', 'verificationDocument'],
                },
            })

            if (!teacher) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Teacher not found',
                })
            }

            return res.status(200).json({
                status: 'success',
                data: teacher,
            })
        } catch (error) {
            logger.error('Error fetching teacher', {
                error: error instanceof Error ? error.message : 'Unknown error',
                teacherId: req.params.id,
            })

            return res.status(500).json({
                status: 'error',
                message: 'Internal server error',
            })
        }
    }

    /**
     * Update teacher verification status
     */
    public async verifyTeacher(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { isVerified } = req.body

            const teacher = await Teacher.findByPk(id)

            if (!teacher) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Teacher not found',
                })
            }

            await teacher.update({ isVerified })

            logger.info('Teacher verification status updated', {
                teacherId: id,
                isVerified,
            })

            return res.status(200).json({
                status: 'success',
                message: 'Teacher verification status updated successfully',
                data: { isVerified },
            })
        } catch (error) {
            logger.error('Error updating teacher verification', {
                error: error instanceof Error ? error.message : 'Unknown error',
                teacherId: req.params.id,
            })

            return res.status(500).json({
                status: 'error',
                message: 'Internal server error',
            })
        }
    }
}

export default new TeacherController()
