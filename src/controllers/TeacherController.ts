// controllers/TeacherController.ts
import { Request, Response } from 'express'
import { teacherService } from '@/services/teacher.service.js'
import { ResponseUtil } from '@/utils/response.util.js'
import { ApplicationStatus } from '@/models/Teacher.js'
import { teacherSchema } from '@/schema/teacher.schema.js'
import { ZodError } from 'zod'

export class TeacherController {
    /**
     * Register a new teacher
     */
    static async registerTeacher(req: Request, res: Response): Promise<void> {
        try {
            const teacher = await teacherService.registerTeacher(req.body)
            res.status(201).json(
                ResponseUtil.success(
                    teacher,
                    'Teacher registered successfully',
                    201,
                ),
            )
        } catch (error) {
            res.status(400).json(
                ResponseUtil.error(
                    error instanceof Error
                        ? error.message
                        : 'Registration failed',
                    400,
                ),
            )
        }
    }
    static async createTeacher(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = teacherSchema.parse(req.body)
            const teacher = await teacherService.registerTeacher({
                ...validatedData,
                role: 'TEACHER',
            })
            res.status(201).json(
                ResponseUtil.success(
                    teacher,
                    'Teacher registered successfully',
                    201,
                ),
            )
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json(
                    ResponseUtil.error(
                        'Validation Error',
                        400,
                        'Failed to validate input',
                    ),
                )
            }
            res.status(400).json(
                ResponseUtil.error(
                    error instanceof Error
                        ? error.message
                        : 'Registration failed',
                    400,
                ),
            )
        }
    }

    /**
     * Get all teachers with pagination, sorting, filtering
     */
    static async getTeachers(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query
            const teachers = await teacherService.getTeachers(query)

            res.status(200).json(
                ResponseUtil.success(
                    teachers,
                    'Teachers retrieved successfully',
                ),
            )
        } catch (error) {
            if (error instanceof Error)
                res.status(500).json(
                    ResponseUtil.error('Failed to fetch teachers', 500),
                )
        }
    }

    /**
     * Get teacher by ID
     */
    static async getTeacherById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const teacher = await teacherService.getTeacherById(id)

            if (!teacher) {
                res.status(404).json(
                    ResponseUtil.error('Teacher not found', 404),
                )
                return
            }

            res.status(200).json(
                ResponseUtil.success(teacher, 'Teacher retrieved successfully'),
            )
        } catch (error) {
            if (error instanceof Error)
                res.status(500).json(
                    ResponseUtil.error('Error fetching teacher', 500),
                )
        }
    }

    /**
     * Accept teacher application
     */
    static async acceptTeacherApplication(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const teacherId = parseInt(req.query.id as string, 10)
            if (isNaN(teacherId)) {
                res.status(400).json(
                    ResponseUtil.error('Invalid teacher ID', 400),
                )
                return
            }

            const updatedTeacher = await teacherService.processApplication(
                teacherId,
                ApplicationStatus.Accepted,
            )

            res.status(200).json(
                ResponseUtil.success(
                    updatedTeacher,
                    'Teacher accepted successfully',
                ),
            )
        } catch (error) {
            res.status(400).json(
                ResponseUtil.error(
                    error instanceof Error
                        ? error.message
                        : 'Failed to accept teacher',
                    400,
                ),
            )
        }
    }

    /**
     * Reject teacher application
     */
    static async rejectTeacherApplication(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const teacherId = parseInt(req.query.id as string, 10)
            if (isNaN(teacherId)) {
                res.status(400).json(
                    ResponseUtil.error('Invalid teacher ID', 400),
                )
                return
            }

            const updatedTeacher = await teacherService.processApplication(
                teacherId,
                ApplicationStatus.Rejected,
            )

            res.status(200).json(
                ResponseUtil.success(
                    updatedTeacher,
                    'Teacher rejected successfully',
                ),
            )
        } catch (error) {
            res.status(400).json(
                ResponseUtil.error(
                    error instanceof Error
                        ? error.message
                        : 'Failed to reject teacher',
                    400,
                ),
            )
        }
    }

    /**
     * Select teacher for interview
     */
    static async interviewTeacherApplication(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const teacherId = parseInt(req.query.id as string, 10)
            if (isNaN(teacherId)) {
                res.status(400).json(
                    ResponseUtil.error('Invalid teacher ID', 400),
                )
                return
            }

            const updatedTeacher = await teacherService.processApplication(
                teacherId,
                ApplicationStatus.Interview,
            )

            res.status(200).json(
                ResponseUtil.success(
                    updatedTeacher,
                    'Teacher selected for interview',
                ),
            )
        } catch (error) {
            res.status(400).json(
                ResponseUtil.error(
                    error instanceof Error
                        ? error.message
                        : 'Failed to select for interview',
                    400,
                ),
            )
        }
    }

    /**
     * Get unregistered teachers (Pending or Interview status)
     */
    static async getUnregisteredTeachers(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const teachers = await teacherService.getUnregisteredTeachers(
                req.query,
            )

            res.status(200).json(
                ResponseUtil.success(
                    teachers,
                    'Unregistered teachers retrieved successfully',
                ),
            )
        } catch (error) {
            if (error instanceof Error)
                res.status(500).json(
                    ResponseUtil.error(
                        'Failed to retrieve unregistered teachers',
                        500,
                    ),
                )
        }
    }
}
