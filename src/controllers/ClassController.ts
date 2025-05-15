import { Request, Response } from 'express'
import { ClassService } from '@/services/class.service.js'
import { ResponseUtil } from '@/utils/response.util.js'
import { CreateClassSchema } from '@/models/Class.js'

// Class Controller
export class ClassController {
    static async createClass(req: Request, res: Response): Promise<void> {
        try {
            const validatedClassData = CreateClassSchema.parse(req.body)

            const newClass = await ClassService.createClass(validatedClassData)
            res.status(201).json(
                ResponseUtil.success(newClass, 'Class created successfully'),
            )
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(
                    ResponseUtil.error(
                        error?.message || 'Failed to create class',
                    ),
                )
            }
        }
    }

    static async getAllClasses(req: Request, res: Response): Promise<void> {
        try {
            const { schoolId } = req.query
            const classes = await ClassService.getAllClasses(
                parseInt(schoolId as string),
            )
            res.status(200).json(
                ResponseUtil.success(classes, 'Classes retrieved successfully'),
            )
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(
                    ResponseUtil.error(
                        error?.message || 'Failed to retrieve classes',
                    ),
                )
            }
        }
    }

    static async getClassById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10) // Parse ID as integer
            const classData = await ClassService.getClassById(id)
            if (!classData) {
                res.status(404).json(ResponseUtil.error('Class not found', 404))
            }
            res.status(200).json(
                ResponseUtil.success(classData, 'Class retrieved successfully'),
            )
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(
                    ResponseUtil.error(
                        error?.message || 'Failed to retrieve class',
                    ),
                )
            }
        }
    }

    static async updateClass(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10)
            const updatedClass = await ClassService.updateClass(id, req.body)
            res.status(200).json(
                ResponseUtil.success(
                    updatedClass,
                    'Class updated successfully',
                ),
            )
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                res.status(400).json(
                    ResponseUtil.error('Failed to update class'),
                )
            }
        }
    }

    static async deleteClass(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10)
            await ClassService.deleteClass(id)
            res.status(204).send() // 204 No Content for successful delete
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(
                    ResponseUtil.error(
                        error?.message || 'Failed to delete class',
                    ),
                )
            }
        }
    }
}
