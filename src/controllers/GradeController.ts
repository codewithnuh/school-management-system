import { Request, Response } from 'express'
import { GradeService } from '@/services/grade.service.js'
import { GradeSchema } from '@/schema/grade.schema.js'
import { ResponseUtil } from '@/utils/response.util.js'

export class GradeController {
    /**
     * Adds a new grade criterion.
     * @param req - The request object.
     * @param res - The response object.
     */
    public static async addGrade(req: Request, res: Response) {
        try {
            const validatedData = GradeSchema.parse(req.body)
            const grade = await GradeService.addGrade(validatedData)
            const response = ResponseUtil.success(
                grade,
                'Grade added successfully',
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
     * Fetches all grade criteria.
     * @param req - The request object.
     * @param res - The response object.
     */
    public static async getAllGrades(req: Request, res: Response) {
        try {
            const grades = await GradeService.getAllGrades()
            const response = ResponseUtil.success(
                grades,
                'Grades retrieved successfully',
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
     * Updates a grade criterion.
     * @param req - The request object.
     * @param res - The response object.
     */
    public static async updateGrade(req: Request, res: Response) {
        try {
            const { id } = req.params
            const gradeId = parseInt(id, 10)
            if (isNaN(gradeId)) throw new Error('Invalid grade ID')

            const validatedData = GradeSchema.parse(req.body)
            const updatedGrade = await GradeService.updateGrade(
                gradeId,
                validatedData,
            )
            const response = ResponseUtil.success(
                updatedGrade,
                'Grade updated successfully',
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
     * Deletes a grade criterion.
     * @param req - The request object.
     * @param res - The response object.
     */
    public static async deleteGrade(req: Request, res: Response) {
        try {
            const { id } = req.params
            const gradeId = parseInt(id, 10)
            if (isNaN(gradeId)) throw new Error('Invalid grade ID')

            await GradeService.deleteGrade(gradeId)
            const response = ResponseUtil.success(
                null,
                'Grade deleted successfully',
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
