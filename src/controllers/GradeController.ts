import { Request, Response } from 'express'
import { GradeService } from '@/services/grade.service.js'
import { GradeSchema } from '@/schema/grade.schema.js'
import { ResponseUtil } from '@/utils/response.util.js'
import { GradeAttributes } from '@/models/Grade' // Import GradeAttributes
import { z } from 'zod' // Import zod

export class GradeController {
    public static async addGrade(req: Request, res: Response): Promise<void> {
        try {
            const validatedData: GradeAttributes = GradeSchema.parse(req.body)
            const grade = await GradeService.createGrade(validatedData)
            const response = ResponseUtil.success(
                grade,
                'Grade added successfully',
            )
            res.status(201).json(response) // 201 Created for successful POST
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Handle Zod validation errors
                const formattedErrors = error.flatten().fieldErrors
                const response = ResponseUtil.error(formattedErrors, 400)
                res.status(400).json(response) // 400 Bad Request
            } else if (error instanceof Error) {
                // Handle other errors
                const response = ResponseUtil.error(error.message, 500) // Or another appropriate status code.
                res.status(500).json(response)
            }
        }
    }

    public static async getAllGrades(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const grades: GradeAttributes[] = await GradeService.getAllGrades()
            const response = ResponseUtil.success(
                grades,
                'Grades retrieved successfully',
            )
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error retrieving grades:', error) // Log for debugging
                const response = ResponseUtil.error(
                    'Failed to retrieve grades',
                    500,
                )
                res.status(500).json(response)
            }
        }
    }

    public static async updateGrade(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params
            const gradeId = parseInt(id, 10)
            if (isNaN(gradeId)) {
                throw new Error('Invalid grade ID')
            }
            const validatedData: GradeAttributes = GradeSchema.parse(req.body)
            const updateResponse = await GradeService.updateGrade(
                gradeId,
                validatedData,
            ) // Expecting the service to return something
            const response = ResponseUtil.success(
                updateResponse,
                'Grade updated successfully',
            )
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Handle Zod errors
                const response = ResponseUtil.error(
                    error.flatten().fieldErrors,
                    400,
                )
                res.status(400).json(response)
            } else if (error instanceof Error) {
                const response = ResponseUtil.error(error.message, 400) // Or 404 if "not found" is likely
                res.status(400).json(response) // Or 404 for "not found".
            }
        }
    }

    public static async deleteGrade(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params
            const gradeId = parseInt(id, 10)
            if (isNaN(gradeId)) {
                throw new Error('Invalid grade ID')
            }

            const deleteResponse = await GradeService.deleteGrade(gradeId) // Get the delete response
            const response = ResponseUtil.success(
                deleteResponse,
                'Grade deleted successfully',
                204,
            ) // Status 204 No Content

            res.status(response.statusCode).json(response) // Or just res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message, 400) // Or 404 if "not found" is likely
                res.status(response.statusCode).json(response)
            }
        }
    }
}
