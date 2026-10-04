import { NotFoundError } from '@/errors/index.js'
import { Class } from '@/models/Class.js'
import { TimeSlot, type TimeSlotAttributes } from '@/models/TimeSlot.js'
import {
    generateTimeSlots,
    type GenerateTimeSlotsInput,
} from '@/utils/timeTableUtils.js'

export class TimeSlotService {
    static async generateTimeSlotsForClass(
        classId: number,
        input: GenerateTimeSlotsInput,
    ): Promise<TimeSlot[]> {
        const schoolClass = await Class.findByPk(classId, {
            attributes: ['id', 'schoolId'],
        })
        if (!schoolClass) throw new NotFoundError('Class')

        const slots = generateTimeSlots(input).map(slot => ({
            ...slot,
            schoolId: schoolClass.schoolId,
        }))
        return TimeSlot.bulkCreate(slots)
    }

    static async updateTimeSlot(
        id: number,
        schoolId: number,
        data: Partial<TimeSlotAttributes>,
    ): Promise<TimeSlot> {
        const timeSlot = await TimeSlot.findOne({ where: { id, schoolId } })
        if (!timeSlot) throw new NotFoundError('Time slot')
        return timeSlot.update(data)
    }

    static async deleteTimeSlot(id: number, schoolId: number): Promise<void> {
        const timeSlot = await TimeSlot.findOne({ where: { id, schoolId } })
        if (!timeSlot) throw new NotFoundError('Time slot')
        await timeSlot.destroy()
    }
}
