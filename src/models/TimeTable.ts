import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany,
} from 'sequelize-typescript'

import { z } from 'zod'
import { Class } from './Class'
import { Section } from './section'
import { TimetableEntry } from './TimeTableEntry'
import { Teacher } from './Teacher'

export const CreateTimetableSchema = z.object({
    classId: z.number(),
    sectionId: z.number(),
    teacherId: z.number(),
    periodsPerDay: z
        .number()
        .int()
        .positive('Periods per day must be a positive integer'),
    periodsPerDayOverrides: z
        .record(
            z.enum([
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
            ]),
            z.number().int().positive(),
        )
        .optional(),
    breakStartTime: z
        .string()
        .regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)')
        .optional(),
    breakEndTime: z
        .string()
        .regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)')
        .optional(),
})

@Table({ tableName: 'timetables' })
export class Timetable extends Model<z.infer<typeof CreateTimetableSchema>> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id!: number

    @ForeignKey(() => Class)
    @Column({ type: DataType.INTEGER, allowNull: false })
    classId!: number

    @BelongsTo(() => Class)
    class!: Class

    @ForeignKey(() => Section)
    @Column({ type: DataType.INTEGER, allowNull: false })
    sectionId!: number

    @BelongsTo(() => Section)
    section!: Section
    @ForeignKey(() => Teacher)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    teacherId!: number

    @BelongsTo(() => Teacher)
    teacher!: Teacher
    @HasMany(() => TimetableEntry)
    timetableEntries!: TimetableEntry[]

    @Column({ type: DataType.INTEGER, allowNull: false })
    periodsPerDay!: number

    @Column({ type: DataType.JSON, allowNull: true })
    periodsPerDayOverrides!: { [day: string]: number }

    @Column({ type: DataType.STRING, allowNull: true })
    breakStartTime!: string

    @Column({ type: DataType.STRING, allowNull: true })
    breakEndTime!: string
}
