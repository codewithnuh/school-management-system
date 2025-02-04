import { createSectionSchema } from '@/models/section.js'
import { SectionService } from '@/services/section.service.js'
import { ResponseUtil } from '@/utils/response.util.js'
import { Response, Request } from 'express'
export class SectionController {
    static async createSection(req: Request, res: Response): Promise<void> {
        try {
            const validatedSectionData = createSectionSchema.parse(req.body)
            const newSection =
                await SectionService.createSection(validatedSectionData)
            res.status(201).json(
                ResponseUtil.success(
                    newSection,
                    'Section created successfully',
                ),
            )
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(
                    ResponseUtil.error(
                        error.message || 'Failed to create section',
                    ),
                )
            }
        }
    }

    static async getAllSections(req: Request, res: Response): Promise<void> {
        try {
            const classId = parseInt(req.params.classId, 10)
            const sections = await SectionService.getAllSections(classId)
            res.status(200).json(
                ResponseUtil.success(
                    sections,
                    'Sections retrieved successfully',
                ),
            )
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(
                    ResponseUtil.error(
                        error.message || 'Failed to retrieve sections',
                    ),
                )
            }
        }
    }

    static async getSectionById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10)
            const section = await SectionService.getSectionById(id)
            if (!section) {
                res.status(404).json(
                    ResponseUtil.error('Section not found', 404),
                )
            }
            res.status(200).json(
                ResponseUtil.success(section, 'Section retrieved successfully'),
            )
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(
                    ResponseUtil.error(
                        error.message || 'Failed to retrieve section',
                    ),
                )
            }
        }
    }

    static async updateSection(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10)
            const updatedSection = await SectionService.updateSection(
                id,
                req.body,
            )
            res.status(200).json(
                ResponseUtil.success(
                    updatedSection,
                    'Section updated successfully',
                ),
            )
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(
                    ResponseUtil.error(
                        error.message || 'Failed to update section',
                    ),
                )
            }
        }
    }

    static async deleteSection(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10)
            await SectionService.deleteSection(id)
            res.status(204).send()
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(
                    ResponseUtil.error(
                        error.message || 'Failed to delete section',
                    ),
                )
            }
        }
    }
}
