import type { Request, Response } from 'express'
import { z } from 'zod'
import { ForbiddenError, NotFoundError, ValidationError } from '@/errors/index.js'
import { Class } from '@/models/Class.js'
import { TimeSlot, TimeSlotSchema } from '@/models/TimeSlot.js'
import { User } from '@/models/User.js'
import { TimeSlotService } from '@/services/timeslot.service.js'

const clockTimeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)
const generateTimeSlotsSchema = z.object({
    classId: z.coerce.number().int().positive(),
    startTime: clockTimeSchema,
    endTime: clockTimeSchema,
    periodLength: z.coerce.number().int().min(1).max(240),
    breakLength: z.coerce.number().int().min(0).max(120).optional(),
})
const updateTimeSlotSchema = TimeSlotSchema.partial().omit({ schoolId: true })

async function getPrincipalSchoolId(req: Request): Promise<number> {
    if (!req.auth) throw new ForbiddenError()
    const user = await User.findByPk(req.auth.userId, { attributes: ['schoolId'] })
    if (!user) throw new ForbiddenError()
    return user.schoolId
}

function parseId(value: string | undefined): number {
    const id = Number(value)
    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new ValidationError('ID must be a positive integer')
    }
    return id
}

export class TimeSlotController {
    static async createTimeSlots(req: Request, res: Response): Promise<void> {
        const input = generateTimeSlotsSchema.parse(req.body)
        const schoolId = await getPrincipalSchoolId(req)
        const schoolClass = await Class.findByPk(input.classId, {
            attributes: ['id', 'schoolId'],
        })
        if (!schoolClass || schoolClass.schoolId !== schoolId) {
            throw new NotFoundError('Class')
        }

        const slots = await TimeSlotService.generateTimeSlotsForClass(
            input.classId,
            input,
        )
        res.status(201).json({ success: true, data: slots })
    }

    static async updateTimeSlot(req: Request, res: Response): Promise<void> {
        const id = parseId(req.params.id)
        const schoolId = await getPrincipalSchoolId(req)
        const input = updateTimeSlotSchema.parse(req.body)
        const timeSlot = await TimeSlotService.updateTimeSlot(id, schoolId, input)
        res.status(200).json({ success: true, data: timeSlot })
    }

    static async deleteTimeSlot(req: Request, res: Response): Promise<void> {
        const id = parseId(req.params.id)
        const schoolId = await getPrincipalSchoolId(req)
        await TimeSlotService.deleteTimeSlot(id, schoolId)
        res.status(204).send()
    }
}
