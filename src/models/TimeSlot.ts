// models/TimeSlot.ts
import { TimetableService } from '@/services/timetable.service'
import {
    Table,
    Column,
    Model,
    DataType,
    AfterDestroy,
    AfterUpdate,
} from 'sequelize-typescript'
import z from 'zod'
import { Timetable } from './TimeTable'

export const TimeSlotSchema = z.object({
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
    day: z.enum(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']),
    type: z.enum(['BREAK', 'LUNCH', 'PERIOD']).optional(),
})

export type TimeSlotAttributes = z.infer<typeof TimeSlotSchema>
// Helper function
function calculateDuration(start: string, end: string): number {
    const [startHours, startMinutes] = start.split(':').map(Number)
    const [endHours, endMinutes] = end.split(':').map(Number)
    return (endHours - startHours) * 60 + (endMinutes - startMinutes)
}
export enum TimeSlotType {
    PERIOD = 'PERIOD',
    BREAK = 'BREAK',
    LUNCH = 'LUNCH',
}
@Table({ tableName: 'time_slots' })
export class TimeSlot extends Model<TimeSlotAttributes> {
    @Column({
        type: DataType.STRING(5),
        allowNull: false,
    })
    startTime!: string

    @Column({
        type: DataType.STRING(5),
        allowNull: false,
    })
    endTime!: string

    @Column({
        type: DataType.ENUM('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'),
        allowNull: false,
    })
    day!: string
    @Column({
        type: DataType.ENUM(...Object.values(TimeSlotType)),
        defaultValue: TimeSlotType.PERIOD,
    })
    type!: TimeSlotType
    @Column({
        type: DataType.VIRTUAL, // Not stored in DB
        get() {
            const start = this.getDataValue('startTime')
            const end = this.getDataValue('endTime')
            return calculateDuration(start, end) // Helper function
        },
    })
    duration!: number
    @AfterUpdate
    @AfterDestroy
    static async regenerateTimetable(timeSlot: TimeSlot) {
        const sectionIds = await (
            await Timetable.findAll({
                where: { timeSlotId: timeSlot.id },
                attributes: ['sectionId'],
                group: ['sectionId'],
            })
        ).map(t => t.sectionId)

        // Regenerate timetable for affected sections

        await Promise.all(
            sectionIds.map(id => TimetableService.generateTimetable(id)),
        )
    }
}
