// controllers/TimetableController.ts
import { Request, Response } from 'express'
import {
    TimetableService,
    TimetableGenerationSchema,
} from '@/services/timetable.service'
import { z } from 'zod'

export class TimetableController {
    /**
     * Generate a timetable for a section
     */
    static async generateTimetable(req: Request, res: Response) {
        try {
            const input = TimetableGenerationSchema.parse(req.body)
            const timetable = await TimetableService.generateTimetable(input)
            res.status(201).json({ success: true, data: timetable })
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ success: false, error: error.errors })
            } else {
                res.status(500).json({ success: false, error: error.message })
            }
        }
    }

    /**
     * Get timetable for a section
     */
    static async getSectionTimetable(req: Request, res: Response) {
        try {
            const sectionId = parseInt(req.params.sectionId, 10)
            if (isNaN(sectionId)) throw new Error('Invalid section ID')

            const timetable =
                await TimetableService.getSectionTimetable(sectionId)
            res.status(200).json({ success: true, data: timetable })
        } catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }

    /**
     * Get timetable for a teacher
     */
    static async getTeacherTimetable(req: Request, res: Response) {
        try {
            const teacherId = parseInt(req.params.teacherId, 10)
            if (isNaN(teacherId)) throw new Error('Invalid teacher ID')

            const timetable =
                await TimetableService.getTeacherTimetable(teacherId)
            res.status(200).json({ success: true, data: timetable })
        } catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }
}
