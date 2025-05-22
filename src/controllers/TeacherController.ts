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
    static async updateTeacher(req: Request, res: Response): Promise<void> {
        try {
            const { teacherId } = req.query
            if (!teacherId) {
                throw new Error('Please provide teacher id') // Corrected check
            }

            const validatedData = req.body
            await teacherService.updateTeacherById(
                parseInt(teacherId as string, 10),
                {
                    ...validatedData,
                    role: 'TEACHER',
                },
            )
            const response = ResponseUtil.success(
                [],
                'Successfully Teacher Updated',
                200,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof ZodError) {
                const response = ResponseUtil.error(
                    'Validation Error', // More descriptive error name
                    400,
                    error.errors.map(err => err.message).join(', '), // More detailed error message
                )
                res.status(response.statusCode).json(response)
                return // Important: return after sending response
            } else if (error instanceof Error) {
                const response = ResponseUtil.error(
                    error.name,
                    400,
                    error.message,
                )
                res.status(response.statusCode).json(response)
                return // Important: return after sending response
            } else {
                // Handle unexpected errors more gracefully
                const response = ResponseUtil.error(
                    'Update Failed', // Generic error message
                    500, // Server error status code
                    'An unexpected error occurred while updating the teacher.',
                )
                res.status(response.statusCode).json(response)
                return // Important: return after sending response
            }
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
    static async getTeachersCount(req: Request, res: Response): Promise<void> {
        try {
            const data = await teacherService.getTeachersCount()
            const response = ResponseUtil.success(
                data,
                'Successfully Teachers Count Retrieved',
                200,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(
                    error.message,
                    400,
                    'Failed to reterieve Teachers Count',
                )
                res.status(response.statusCode).json(response)
            }
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
    static async getTeachersBySchoolId(req: Request, res: Response) {
        try {
            const { schoolId } = req.params
            const teachers = await teacherService.getAllTeachersBySchoolId(
                parseInt(schoolId, 10),
            )
            const response = ResponseUtil.success(
                teachers,
                'Successfully retrieve teachers',
                200,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(
                    error.message,
                    400,
                    'Failed to retrieve teachers',
                )
                res.status(response.statusCode).json(response)
            }
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
