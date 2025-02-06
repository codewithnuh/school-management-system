// section.model.ts
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
import { Class, Timetable, TimetableEntry } from '@/models/index.js'

export const createSectionSchema = z.object({
    name: z.string({
        required_error: 'Name is required',
    }),
    classTeacherId: z.number({
        required_error: 'Class teacher ID is required',
    }),
    subjectTeachers: z.record(z.number(), z.number(), {
        required_error: 'Subject teachers mapping is required',
    }),
    classId: z.number({
        required_error: 'Class ID is required',
    }),
})

export type CreateSectionInput = z.infer<typeof createSectionSchema>
@Table({ tableName: 'sections' })
export class Section extends Model {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    })
    id!: number

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string

    // Class Teacher Relationship
    @ForeignKey(() => Teacher)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    classTeacherId!: number

    // Subject Teachers Mapping
    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    subjectTeachers!: Record<number, number>

    // Class Relationship
    @ForeignKey(() => Class)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    classId!: number

    @BelongsTo(() => Class)
    class!: Class

    // Timetable Relationships
    @HasMany(() => Timetable)
    timetables!: Timetable[]

    @HasMany(() => TimetableEntry)
    timetableEntries!: TimetableEntry[]
}

// Import Teacher AFTER the class definition
import { Teacher } from '@/models/index.js'
