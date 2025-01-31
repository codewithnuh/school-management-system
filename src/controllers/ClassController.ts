import { Request, Response } from 'express'
import { ClassService, UpdatePeriodsSchema } from '@/services/class.service'
import { z } from 'zod'
import { ResponseUtil } from '@/utils/response.util'

export class ClassController {
    /**
     * Update the number of periods per day for a class
     */
    static async updatePeriodsPerDay(req: Request, res: Response) {
        try {
            const classId = parseInt(req.params.classId, 10)
            if (isNaN(classId)) throw new Error('Invalid class ID')

            const input = UpdatePeriodsSchema.parse(req.body)
            const updatedClass = await ClassService.updatePeriodsPerDay(
                classId,
                input,
            )

            res.status(200).json({ success: true, data: updatedClass })
        } catch (error) {
            if (error instanceof z.ZodError) {
                const response = ResponseUtil.error(
                    error.name,
                    500,
                    error.message,
                )
                res.status(400).json(response)
            } else {
                if (error instanceof Error) {
                    const response = ResponseUtil.error(
                        error.name,
                        500,
                        error.message,
                    )
                    res.status(400).json(response)
                }
            }
        }
    }

    /**
     * Get class details by ID
     */
    static async getClassById(req: Request, res: Response) {
        try {
            const classId = parseInt(req.params.classId, 10)
            if (isNaN(classId)) throw new Error('Invalid class ID')

            const classDetails = await ClassService.getClassById(classId)
            if (!classDetails) throw new Error('Class not found')
            const response = ResponseUtil.success(
                classDetails,
                'Class has been fetched successfully',
                200,
            )
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(
                    error.name,
                    500,
                    error.message,
                )
                res.status(500).json(response)
            }
        }
    }

    /**
     * Create a new class
     */
    static async createClass(req: Request, res: Response) {
        try {
            const { name, periodsPerDay } = req.body
            if (!name || !periodsPerDay)
                throw new Error('Name and periodsPerDay are required')

            const newClass = await ClassService.createClass(name, periodsPerDay)
            const response = ResponseUtil.success(
                newClass,
                'Class has been created',
                201,
            )
            res.status(201).json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(
                    error.name,
                    500,
                    error.message,
                )
                res.status(500).json(response)
            }
        }
    }
}
