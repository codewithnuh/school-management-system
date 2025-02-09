import { Request, Response } from 'express'
import { GradeService } from '@/services/grade.service.js'

import { ResponseUtil } from '@/utils/response.util.js'
import { GradeAttributes, gradeSchema as GradeSchema } from '@/models/Grade.js'
import { z } from 'zod'

export class GradeController {
    public static async addGrade(req: Request, res: Response): Promise<void> {
        try {
            const validatedData: GradeAttributes = GradeSchema.parse(req.body)
            const grade = await GradeService.createGrade(validatedData)
            const response = ResponseUtil.success(
                grade,
                'Grade added successfully',
            )
            res.status(201).json(response)
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors = this.formatZodErrors(error) //Helper function (see below)
                const response = ResponseUtil.error(
                    JSON.stringify(formattedErrors),
                    400,
                )
                res.status(400).json(response)
            } else if (error instanceof Error) {
                console.error('Error adding grade:', error) //Log the error
                const response = ResponseUtil.error(error.message, 500)
                res.status(500).json(response)
            } else {
                console.error('Unknown error adding grade:', error)
                const response = ResponseUtil.error(
                    'An unknown error occurred',
                    500,
                )
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
            console.error('Error retrieving grades:', error)
            const response = ResponseUtil.error(
                'Failed to retrieve grades',
                500,
            )
            res.status(500).json(response)
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
            await GradeService.updateGrade(gradeId, validatedData) // Assumes updateGrade returns void
            const response = ResponseUtil.success(
                null,
                'Grade updated successfully',
                204,
            ) //204 for no content
            res.status(204).json(response)
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors = this.formatZodErrors(error)
                const response = ResponseUtil.error(
                    JSON.stringify(formattedErrors),
                    400,
                )
                res.status(400).json(response)
            } else if (error instanceof Error) {
                if (error.message.includes('not found')) {
                    const response = ResponseUtil.error(error.message, 404)
                    res.status(404).json(response)
                } else {
                    const response = ResponseUtil.error(error.message, 500)
                    res.status(500).json(response)
                }
            } else {
                console.error('Unknown error updating grade:', error)
                const response = ResponseUtil.error(
                    'An unknown error occurred',
                    500,
                )
                res.status(500).json(response)
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
            await GradeService.deleteGrade(gradeId)
            res.status(204).send() // 204 No Content
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('not found')) {
                    const response = ResponseUtil.error(error.message, 404)
                    res.status(404).json(response)
                } else {
                    const response = ResponseUtil.error(error.message, 500)
                    res.status(500).json(response)
                }
            } else {
                console.error('Unknown error deleting grade:', error)
                const response = ResponseUtil.error(
                    'An unknown error occurred',
                    500,
                )
                res.status(500).json(response)
            }
        }
    }

    // Helper function to format Zod errors
    private static formatZodErrors(error: z.ZodError): {
        [key: string]: string
    } {
        return Object.entries(error.flatten().fieldErrors).reduce(
            (acc, [field, errors]) => {
                acc[field] = errors!.join(', ')
                return acc
            },
            {} as { [key: string]: string },
        )
    }
}
