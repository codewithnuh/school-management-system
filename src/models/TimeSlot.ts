import type { Optional } from 'sequelize'
import {
    Column,
    CreatedAt,
    DataType,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript'
import { z } from 'zod'

export const TimeSlotSchema = z.object({
    schoolId: z.number().int().positive(),
    name: z.string().trim().min(1).max(80),
    startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    periodNumber: z.number().int().positive(),
    isBreak: z.boolean().default(false),
    isActive: z.boolean().default(true),
})

export interface TimeSlotAttributes {
    id: number
    schoolId: number
    name: string
    startTime: string
    endTime: string
    periodNumber: number
    isBreak: boolean
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export type TimeSlotCreationAttributes = Optional<
    TimeSlotAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'isBreak' | 'isActive'
>

@Table({ tableName: 'time_slots', timestamps: true, underscored: true })
export class TimeSlot extends Model<
    TimeSlotAttributes,
    TimeSlotCreationAttributes
> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id: number

    @Column({ type: DataType.INTEGER, allowNull: false, field: 'school_id' })
    declare schoolId: number

    @Column({ type: DataType.STRING(80), allowNull: false })
    declare name: string

    @Column({ type: DataType.TIME, allowNull: false, field: 'start_time' })
    declare startTime: string

    @Column({ type: DataType.TIME, allowNull: false, field: 'end_time' })
    declare endTime: string

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'period_number',
    })
    declare periodNumber: number

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_break',
    })
    declare isBreak: boolean

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
    })
    declare isActive: boolean

    @CreatedAt
    @Column({ type: DataType.DATE, field: 'created_at' })
    declare createdAt: Date

    @UpdatedAt
    @Column({ type: DataType.DATE, field: 'updated_at' })
    declare updatedAt: Date
}
