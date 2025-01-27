// controllers/teacher.controller.ts
import { ResponseUtil } from '@/utils/response.util'
import { Request, Response } from 'express'
import { Teacher } from '../models/Teacher'
import { teacherSchema } from '@/schema/teacher.schema'
import { logger } from '@/middleware/loggin.middleware'
import { Op } from 'sequelize'
import { processTeacherApplication } from '@/services/application.service'

class TeacherController {
    /**
     * Register a new teacher
     */
    public registerTeacher = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        try {
            // Validate request body against schema
            const validatedData = teacherSchema.parse(req.body)
            console.log('validatedData', validatedData)
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
                const response = ResponseUtil.error('Teacher with this email or CNIC already exists', 409)
                res.status(response.statusCode).json(response)
                return
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

            const response = ResponseUtil.success(teacherData, 'Teacher registered successfully', 201)
            res.status(response.statusCode).json(response)
            return
        } catch (error) {
            logger.error('Teacher registration failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            })

            if (error instanceof Error) {
                if (error.name === 'ZodError') {
                    res.status(400).json({
                        success: false,
                        message: 'Validation failed',
                        errors: error.message, // Send message instead of stack trace
                    })
                }

                res.status(400).json({
                    success: false,
                    message: error.message,
                })
                return
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error',
            })
            return
        }
    }
    /**
     * Get all teachers with pagination
     */
    public getTeachers = async (req: Request, res: Response): Promise<void> => {
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

            const response = ResponseUtil.success({
                teachers: teachers.rows,
                total: teachers.count,
                currentPage: page,
                totalPages: Math.ceil(teachers.count / limit),
            })
            res.status(response.statusCode).json(response)
            return
        } catch (error) {
            logger.error('Error fetching teachers', {
                error: error instanceof Error ? error.message : 'Unknown error',
            })

            const response = ResponseUtil.error('Internal server error', 500)
            res.status(response.statusCode).json(response)
            return
        }
    }

    /**
     * Get teacher by ID
     */
    public getTeacherById = async (req: Request, res: Response) => {
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
                success: true,
                data: teacher,
            })
        } catch (error) {
            logger.error('Error fetching teacher', {
                error: error instanceof Error ? error.message : 'Unknown error',
                teacherId: req.params.id,
            })

            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            })
        }
    }

    /**
     * Update teacher verification status
     */
    public acceptTeacherApplication = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const teacherId = req.query.id
        console.log(teacherId)
        if (teacherId === undefined || isNaN(Number(teacherId))) {
            res.status(400).json({ error: 'Invalid or missing teacher ID' })
            return
        }

        try {
            const numericTeacherId = Number(teacherId)
            await processTeacherApplication(numericTeacherId, 'Accepted')

            res.status(200).json({
                success: true,
                message: 'Teacher registered successfully',
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

    public rejectTeacherApplication = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const teacherId = req.query.id
        if (teacherId === undefined || isNaN(Number(teacherId))) {
            res.status(400).json({ error: 'Invalid or missing teacher ID' })
            return
        }

        try {
            const numericTeacherId = Number(teacherId)
            await processTeacherApplication(numericTeacherId, 'Rejected')

            res.status(200).json({
                success: true,
                message: 'Teacher application rejected successfully',
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

    public interviewTeacherApplicant = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const teacherId = req.query.id
        if (teacherId === undefined || isNaN(Number(teacherId))) {
            res.status(400).json({ error: 'Invalid or missing teacher ID' })
            return
        }

        try {
            const numericTeacherId = Number(teacherId)
            await processTeacherApplication(numericTeacherId, 'Interview')

            res.status(200).json({
                success: true,
                message: 'Teacher selected for interview successfully',
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
}

export default new TeacherController()
