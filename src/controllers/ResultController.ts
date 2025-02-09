import { Request, Response } from 'express'
import { ResultService } from '@/services/result.service.js' // Adjust path if necessary
import { resultSchema as ResultSchema } from '@/models/Result.js' // Adjust path if necessary
import { ResponseUtil } from '@/utils/response.util.js'
import { Result, ResultAttributes } from '@/models/Result.js' // Adjust path if necessary

export class ResultController {
    /**
     * Creates a new exam result.
     *
     * @param req - Express request object
     * @param res - Express response object
     */
    public static async createResult(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const validatedData = ResultSchema.parse(
                req.body,
            ) as ResultAttributes // Validate request body
            const result = await ResultService.createResult(validatedData)
            const response = ResponseUtil.success<Result>(
                result,
                'Result created successfully',
                201,
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error creating result:', error)
            const genericMessage =
                'Failed to create result. Please check your input.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    /**
     * Fetches all exam results.
     *
     * @param req - Express request object
     * @param res - Express response object
     */
    public static async getAllResults(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const results = await ResultService.getAllResults()
            const response = ResponseUtil.success<Result[]>(
                results,
                'Results retrieved successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error fetching all results:', error)
            const genericMessage =
                'Failed to retrieve results. Please try again later.'
            const response = ResponseUtil.error(genericMessage, 500)
            res.status(response.statusCode).json(response)
        }
    }

    /**
     * Fetches a single exam result by ID.
     *
     * @param req - Express request object
     * @param res - Express response object
     */
    public static async getResultById(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params
            const resultId = parseInt(id, 10)
            if (isNaN(resultId)) throw new Error('Invalid Result ID')

            const result = await ResultService.getResultById(resultId)
            if (!result) {
                const notFoundResponse = ResponseUtil.error(
                    'Result not found',
                    404,
                )
                res.status(notFoundResponse.statusCode).json(notFoundResponse)
                return // Important to return to prevent further execution
            }
            const response = ResponseUtil.success<Result>(
                result,
                'Result retrieved successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error fetching result by ID:', error)
            const genericMessage =
                'Failed to retrieve result. Please check the Result ID.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    /**
     * Fetches all results for a specific student.
     *
     * @param req - Express request object, expects studentId in params
     * @param res - Express response object
     */
    public static async getResultsByStudentId(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { studentId } = req.params
            const studentIdParsed = parseInt(studentId, 10)
            if (isNaN(studentIdParsed)) throw new Error('Invalid Student ID')

            const results =
                await ResultService.getResultsByStudentId(studentIdParsed)
            const response = ResponseUtil.success<Result[]>(
                results,
                'Results retrieved successfully for student',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error fetching results by student ID:', error)
            const genericMessage =
                'Failed to retrieve results for the student. Please check the Student ID.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    /**
     * Fetches all results for a specific exam.
     *
     * @param req - Express request object, expects examId in params
     * @param res - Express response object
     */
    public static async getResultsByExamId(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { examId } = req.params
            const examIdParsed = parseInt(examId, 10)
            if (isNaN(examIdParsed)) throw new Error('Invalid Exam ID')

            const results = await ResultService.getResultsByExamId(examIdParsed)
            const response = ResponseUtil.success<Result[]>(
                results,
                'Results retrieved successfully for exam',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error fetching results by exam ID:', error)
            const genericMessage =
                'Failed to retrieve results for the exam. Please check the Exam ID.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    /**
     * Updates an existing exam result.
     *
     * @param req - Express request object, expects resultId in params and updates in body
     * @param res - Express response object
     */
    public static async updateResult(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params
            const resultId = parseInt(id, 10)
            if (isNaN(resultId)) throw new Error('Invalid Result ID')

            const validatedUpdates = ResultSchema.partial().parse(
                req.body,
            ) as Partial<ResultAttributes> // Validate update body
            const affectedRows = await ResultService.updateResult(
                resultId,
                validatedUpdates,
            )
            if (affectedRows === 0) {
                const notFoundResponse = ResponseUtil.error(
                    'Result not found for update',
                    404,
                )
                res.status(notFoundResponse.statusCode).json(notFoundResponse)
                return
            }
            const response = ResponseUtil.success<number>(
                affectedRows,
                'Result updated successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error updating result:', error)
            const genericMessage =
                'Failed to update result. Please check your input and Result ID.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    /**
     * Deletes an exam result.
     *
     * @param req - Express request object, expects resultId in params
     * @param res - Express response object
     */
    public static async deleteResult(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params
            const resultId = parseInt(id, 10)
            if (isNaN(resultId)) throw new Error('Invalid Result ID')

            const deletedRows = await ResultService.deleteResult(resultId)
            if (deletedRows === 0) {
                const notFoundResponse = ResponseUtil.error(
                    'Result not found for deletion',
                    404,
                )
                res.status(notFoundResponse.statusCode).json(notFoundResponse)
                return
            }
            const response = ResponseUtil.success<number>(
                deletedRows,
                'Result deleted successfully',
                204,
            ) // 204 No Content
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error deleting result:', error)
            const genericMessage =
                'Failed to delete result. Please check the Result ID.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }
}
