// controllers/TimetableController.ts
import { Request, Response } from 'express'
import {
    TimetableService,
    TimetableGenerationSchema,
} from '@/services/timetable.service'
import { z } from 'zod'
import { ResponseUtil } from '@/utils/response.util'
import { logger } from '@/middleware/loggin.middleware'
import { Timetable } from '@/models/TimeTable'
import { Subject } from '@/models/Subject'
import { Teacher } from '@/models/Teacher'
import { TimeSlot, TimeSlotType } from '@/models/TimeSlot'

export class TimetableController {
    /**
     * Generate a timetable for a section
     */
    static async generateTimetable(req: Request, res: Response) {
        try {
            const input = TimetableGenerationSchema.parse(req.body)
            const timetable = await TimetableService.generateTimetable(
                input.sectionId,
            )
            const response = ResponseUtil.success(
                timetable,
                'Time Table Successfully generated',
                201,
            )
            res.status(201).json(response)
        } catch (error) {
            if (error instanceof z.ZodError) {
                const response = ResponseUtil.error(
                    'Validation Error',
                    400,
                    error.message,
                )

                res.status(400).json(response)
            } else {
                if (error instanceof Error) {
                    const response = ResponseUtil.error(
                        'Internal Server Error',
                        400,
                        error.message,
                    )
                    console.error(error.stack)
                    res.status(500).json(response)
                }
            }
        }
    }

    /**
     * Get timetable for a section
     */
    static async getSectionTimetable(req: Request, res: Response) {
        const timetable = await Timetable.findAll({
            where: { sectionId: req.params.sectionId },
            include: [
                {
                    model: TimeSlot,
                    attributes: ['id', 'startTime', 'endTime', 'day', 'type'],
                },
                Subject,
                Teacher,
            ],
        })

        // Format timetable with breaks
        const formatted = timetable.map(entry => ({
            ...entry.toJSON(),
            isBreak: entry.timeSlot.type !== TimeSlotType.PERIOD,
        }))

        res.json({ success: true, data: formatted })
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
            const response = ResponseUtil.success(
                timetable,
                'Time Table Successfully fetched',
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
    static async regenerateTimetable(req: Request, res: Response) {
        try {
            const timetable = await TimetableService.generateTimetable(
                Number(req.params.sectionId),
            )
            res.status(200).json({ success: true, data: timetable })
        } catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }
}
