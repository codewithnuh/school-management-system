// models/TimeSlot.ts
import { Table, Column, Model, DataType } from 'sequelize-typescript'
import z from 'zod'

export const TimeSlotSchema = z.object({
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
    day: z.enum(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']),
})

export type TimeSlotAttributes = z.infer<typeof TimeSlotSchema>

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
}
