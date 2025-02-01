import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript'
import { z } from 'zod'
import { Subject } from './Subject'
import { Teacher } from './Teacher'
import { Timetable } from './TimeTable'

export const CreateTimetableEntrySchema = z.object({
    dayOfWeek: z.enum([
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ]),
    periodNumber: z.number().int().positive(),
    subjectId: z.number().int().positive(),
    teacherId: z.number().int().positive(),
    startTime: z
        .string()
        .regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)')
        .optional(),
    endTime: z
        .string()
        .regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)')
        .optional(),
})

@Table({ tableName: 'timetable_entries' })
export class TimetableEntry extends Model<
    z.infer<typeof CreateTimetableEntrySchema>
> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id!: number

    @ForeignKey(() => Timetable)
    @Column({ type: DataType.INTEGER, allowNull: false })
    timetableId!: number

    @BelongsTo(() => Timetable)
    timetable!: Timetable

    @Column({
        type: DataType.ENUM(
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
        ),
        allowNull: false,
    })
    dayOfWeek!: string

    @Column({ type: DataType.INTEGER, allowNull: false })
    periodNumber!: number

    @ForeignKey(() => Subject)
    @Column({ type: DataType.INTEGER, allowNull: false })
    subjectId!: number

    @BelongsTo(() => Subject)
    subject!: Subject

    @ForeignKey(() => Teacher)
    @Column({ type: DataType.INTEGER, allowNull: false })
    teacherId!: number

    @BelongsTo(() => Teacher)
    teacher!: Teacher

    @Column({ type: DataType.STRING, allowNull: true })
    startTime!: string

    @Column({ type: DataType.STRING, allowNull: true })
    endTime!: string
}
