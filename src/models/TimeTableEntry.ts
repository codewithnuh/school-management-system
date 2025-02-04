import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript'
import { z } from 'zod'
export const TimetableEntrySchema = z.object({
    id: z.number().optional(),
    timetableId: z.number(),
    sectionId: z.number(),
    subjectId: z.number(),
    teacherId: z.number(),
    dayOfWeek: z.string(),
    periodNumber: z.number(),
    startTime: z.string(),
    endTime: z.string(),
    classId: z.number(),
})

export type TimetableEntryType = z.infer<typeof TimetableEntrySchema>

@Table({
    tableName: 'timetable_entries',
    timestamps: true,
})
export class TimetableEntry
    extends Model<TimetableEntryType>
    implements TimetableEntryType
{
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    })
    id!: number

    @ForeignKey(() => Timetable)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    timetableId!: number

    @BelongsTo(() => Timetable)
    timetable!: Timetable

    @ForeignKey(() => Section)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    sectionId!: number

    @BelongsTo(() => Section)
    section!: Section
    @ForeignKey(() => Class)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    classId!: number

    @BelongsTo(() => Class)
    class!: Class

    @ForeignKey(() => Subject)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    subjectId!: number

    @BelongsTo(() => Subject)
    subject!: Subject

    @ForeignKey(() => Teacher)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    teacherId!: number

    @BelongsTo(() => Teacher)
    teacher!: Teacher

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    dayOfWeek!: string

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    periodNumber!: number

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    startTime!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    endTime!: string
}

import { Class, Teacher, Subject, Section, Timetable } from '@/models/index.js'
