import { Request, Response } from 'express'
import { SubjectService } from '@/services/subject.service.js'
import { ResponseUtil } from '@/utils/response.util.js'

export class SubjectController {
    /**
     * Create a new subject.
     */
    public static async create(req: Request, res: Response) {
        try {
            const subject = await SubjectService.createSubject(req.body)
            const response = ResponseUtil.success(
                subject,
                'Subject created successfully',
                201,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            const response = ResponseUtil.error(
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred',
                400,
            )
            res.status(response.statusCode).json(response)
        }
    }

    /**
     * Get a subject by ID.
     */
    public static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params
            const subject = await SubjectService.getSubjectById(Number(id))
            const response = ResponseUtil.success(
                subject,
                'Subject retrieved successfully',
                200,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            const response = ResponseUtil.error(
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred',
                404,
            )
            res.status(response.statusCode).json(response)
        }
    }

    /**
     * Get all subjects.
     */
    public static async getAll(req: Request, res: Response) {
        const { schoolId } = req.query
        if (!schoolId) throw new Error('Please provide schoolId')
        try {
            const subjects = await SubjectService.getAllSubjects(
                parseInt(schoolId as string, 10),
            )
            const response = ResponseUtil.success(
                subjects,
                'Subjects retrieved successfully',
                200,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            const response = ResponseUtil.error(
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred',
                500,
            )
            res.status(response.statusCode).json(response)
        }
    }

    /**
     * Update a subject.
     */
    public static async update(req: Request, res: Response) {
        try {
            const { id } = req.params
            const subjectData = req.body
            const updatedSubject = await SubjectService.updateSubject(
                Number(id),
                subjectData,
            )
            const response = ResponseUtil.success(
                updatedSubject,
                'Subject updated successfully',
                200,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            const response = ResponseUtil.error(
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred',
                400,
            )
            res.status(response.statusCode).json(response)
        }
    }

    /**
     * Delete a subject.
     */
    public static async delete(req: Request, res: Response) {
        try {
            const { id, schoolId } = req.query
            if (!id || !schoolId)
                throw new Error('Please provide id and schoolId')
            const deletedSubject = await SubjectService.deleteSubject(
                Number(id),
                Number(schoolId),
            )
            const response = ResponseUtil.success(
                deletedSubject,
                'Subject deleted successfully',
                200,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            console.log(`[DEBUG]: SUBJECT DELETION Error ${error}`)
            const response = ResponseUtil.error(
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred',
                404,
            )
            res.status(response.statusCode).json(response)
        }
    }
}
