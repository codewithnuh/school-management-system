import { Request, Response } from 'express'
import { ExamService } from '@/services/exam.service.js'
import { ExamSchema } from '@/schema/exam.schema.js'
import { ResponseUtil } from '@/utils/response.util.js'

export class ExamController {
    /**
     * Creates a new exam.
     * @param req - The request object.
     * @param res - The response object.
     */
    public static async createExam(req: Request, res: Response) {
        try {
            const validatedData = ExamSchema.parse(req.body)
            const exam = await ExamService.createExam(validatedData)
            const response = ResponseUtil.success(
                exam,
                'Exam created successfully',
                201,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message, 400)
                res.status(response.statusCode).json(response)
            }
        }
    }

    /**
     * Fetches all exams.
     * @param req - The request object.
     * @param res - The response object.
     */
    public static async getAllExams(req: Request, res: Response) {
        try {
            const exams = await ExamService.getAllExams()
            const response = ResponseUtil.success(
                exams,
                'Exams retrieved successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message, 500)
                res.status(response.statusCode).json(response)
            }
        }
    }

    /**
     * Fetches an exam by ID.
     * @param req - The request object.
     * @param res - The response object.
     */
    public static async getExamById(req: Request, res: Response) {
        try {
            const { id } = req.params
            const examId = parseInt(id, 10)
            if (isNaN(examId)) throw new Error('Invalid exam ID')

            const exam = await ExamService.getExamById(examId)
            const response = ResponseUtil.success(
                exam,
                'Exam retrieved successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message, 400)
                res.status(response.statusCode).json(response)
            }
        }
    }

    /**
     * Updates an exam.
     * @param req - The request object.
     * @param res - The response object.
     */
    public static async updateExam(req: Request, res: Response) {
        try {
            const { id } = req.params
            const examId = parseInt(id, 10)
            if (isNaN(examId)) throw new Error('Invalid exam ID')

            const validatedData = ExamSchema.parse(req.body)
            const updatedExam = await ExamService.updateExam(
                examId,
                validatedData,
            )
            const response = ResponseUtil.success(
                updatedExam,
                'Exam updated successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message, 400)
                res.status(response.statusCode).json(response)
            }
        }
    }

    /**
     * Deletes an exam.
     * @param req - The request object.
     * @param res - The response object.
     */
    public static async deleteExam(req: Request, res: Response) {
        try {
            const { id } = req.params
            const examId = parseInt(id, 10)
            if (isNaN(examId)) throw new Error('Invalid exam ID')

            await ExamService.deleteExam(examId)
            const response = ResponseUtil.success(
                null,
                'Exam deleted successfully',
                204,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message, 400)
                res.status(response.statusCode).json(response)
            }
        }
    }
}
