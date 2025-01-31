import { TimeSlot, TimeSlotAttributes } from '@/models/TimeSlot'
import {
    generateTimeSlots,
    GenerateTimeSlotsInput,
} from '@/utils/timeTableUtils'

// services/TimeSlotService.ts
export class TimeSlotService {
    static async generateTimeSlotsForClass(
        classId: number,
        input: GenerateTimeSlotsInput,
    ) {
        const slots = generateTimeSlots(input)
        return TimeSlot.bulkCreate(slots)
    }

    static async updateTimeSlot(id: string, data: Partial<TimeSlotAttributes>) {
        const timeSlot = await TimeSlot.findByPk(id)
        if (!timeSlot) throw new Error('Time slot not found')
        return timeSlot.update(data)
    }

    static async deleteTimeSlot(id: string) {
        const timeSlot = await TimeSlot.findByPk(id)
        if (!timeSlot) throw new Error('Time slot not found')
        await timeSlot.destroy()
    }
}
