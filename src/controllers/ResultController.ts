import { Request, Response } from 'express'
import { ResultService } from '@/services/result.service.js'
import { ResultSchema } from '@/schema/result.schema.js'
import { ResponseUtil } from '@/utils/response.util.js'

export class ResultController {
    /**
     * Records marks for a student in an exam subject.
     * @param req - The request object.
     * @param res - The response object.
     */
    public static async recordMarks(req: Request, res: Response) {
        try {
            const validatedData = ResultSchema.parse(req.body)
            const result = await ResultService.recordMarks(validatedData)
            const response = ResponseUtil.success(
                result,
                'Marks recorded successfully',
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
     * Fetches results for a specific student.
     * @param req - The request object.
     * @param res - The response object.
     */
    public static async getResultsForStudent(req: Request, res: Response) {
        try {
            const { studentId } = req.params
            const studentIdNumber = parseInt(studentId, 10)
            if (isNaN(studentIdNumber)) throw new Error('Invalid student ID')

            const results =
                await ResultService.getResultsForStudent(studentIdNumber)
            const response = ResponseUtil.success(
                results,
                'Results retrieved successfully',
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
     * Fetches results for a specific exam.
     * @param req - The request object.
     * @param res - The response object.
     */
    public static async getResultsForExam(req: Request, res: Response) {
        try {
            const { examId } = req.params
            const examIdNumber = parseInt(examId, 10)
            if (isNaN(examIdNumber)) throw new Error('Invalid exam ID')

            const results = await ResultService.getResultsForExam(examIdNumber)
            const response = ResponseUtil.success(
                results,
                'Results retrieved successfully',
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
     * Calculates grades for a result based on marks obtained.
     * @param req - The request object.
     * @param res - The response object.
     */
    public static async calculateGrade(req: Request, res: Response) {
        try {
            const { marksObtained } = req.body
            const grade = await ResultService.calculateGrade(marksObtained)
            const response = ResponseUtil.success(
                { grade },
                'Grade calculated successfully',
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
