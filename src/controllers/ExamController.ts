import { Request, Response } from 'express'
import { ExamService } from '@/services/exam.service.js'
import { ExamSchema } from '@/schema/exam.schema.js'
import { ResponseUtil } from '@/utils/response.util.js'

export class ExamController {
    /**
     * Securely creates a new exam.
     * In case of an error, a generic error message is returned while detailed error logging is performed internally.
     *
     * @param req - The incoming request object
     * @param res - The response object used to return the results
     */
    public static async createExam(req: Request, res: Response): Promise<void> {
        try {
            // Parse and validate data. ExamSchema.parse will throw if invalid.
            const validatedData = ExamSchema.parse(req.body)
            const exam = await ExamService.createExam(validatedData)
            const response = ResponseUtil.success(
                exam,
                'Exam created successfully',
                201,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            // Log the detailed error internally for diagnostics.
            console.error('Error during exam creation:', error)
            // Return a generic error message to the client.
            const genericMessage =
                'Exam creation failed. Please verify your input and try again.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    /**
     * Fetches all exams.
     *
     * @param req - The request object
     * @param res - The response object
     */
    public static async getAllExams(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const exams = await ExamService.getAllExams()
            const response = ResponseUtil.success(
                exams,
                'Exams retrieved successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            // Log detailed error for internal diagnostics.
            console.error('Error fetching all exams:', error)
            // Return a generic error message to the client.
            const genericMessage =
                'Failed to retrieve exams. Please try again later.'
            const response = ResponseUtil.error(genericMessage, 500)
            res.status(response.statusCode).json(response)
        }
    }

    /**
     * Fetches an exam by ID.
     *
     * @param req - The request object
     * @param res - The response object
     */
    public static async getExamById(
        req: Request,
        res: Response,
    ): Promise<void> {
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
            console.error('Error fetching exam by ID:', error)
            // Use a generic error message without revealing whether the exam exists or not.
            const genericMessage =
                'Failed to retrieve exam. Please verify your request.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    /**
     * Updates an exam.
     *
     * @param req - The request object
     * @param res - The response object
     */
    public static async updateExam(req: Request, res: Response): Promise<void> {
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
            console.error('Error during exam update:', error)
            // Return a generic message for failures in updating.
            const genericMessage =
                'Exam update failed. Please ensure your input is correct and try again.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    /**
     * Deletes an exam.
     *
     * @param req - The request object
     * @param res - The response object
     */
    public static async deleteExam(req: Request, res: Response): Promise<void> {
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
            console.error('Error during exam deletion:', error)
            // Return a generic message for deletion failures.
            const genericMessage =
                'Exam deletion failed. Please try again later.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }
}
