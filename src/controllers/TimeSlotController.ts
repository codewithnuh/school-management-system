import { Request, Response } from 'express'
import { TimeSlotService } from '@/services/timeslot.service'

export class TimeSlotController {
    // Create time slots
    static async createTimeSlots(req: Request, res: Response) {
        try {
            const { classId, startTime, endTime, periodLength, breakLength } =
                req.body
            const slots = await TimeSlotService.generateTimeSlotsForClass(
                classId,
                {
                    startTime,
                    endTime,
                    periodLength,
                    breakLength,
                },
            )
            res.status(201).json({ success: true, data: slots })
        } catch (error) {
            if (error instanceof Error)
                res.status(500).json({ success: false, error: error.message })
        }
    }

    // Update a time slot
    static async updateTimeSlot(req: Request, res: Response) {
        try {
            const timeSlot = await TimeSlotService.updateTimeSlot(
                req.params.id,
                req.body,
            )
            res.status(200).json({ success: true, data: timeSlot })
        } catch (error) {
            if (error instanceof Error)
                res.status(500).json({ success: false, error: error.message })
        }
    }

    // Delete a time slot
    static async deleteTimeSlot(req: Request, res: Response) {
        try {
            await TimeSlotService.deleteTimeSlot(req.params.id)
            res.status(204).send()
        } catch (error) {
            if (error instanceof Error)
                res.status(500).json({ success: false, error: error.message })
        }
    }
}
