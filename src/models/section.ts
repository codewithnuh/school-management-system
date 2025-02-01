import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany,
} from 'sequelize-typescript'
import { Class } from './Class'
import { Teacher } from './Teacher'
import { Subject } from './Subject'
import { z } from 'zod'

export const CreateSectionSchema = z.object({
    id: z.number().optional(),
    name: z.string().length(1, 'Section name must be a single character'),
    maxStudents: z
        .number()
        .min(1, 'Max students per section must be at least 1'),
    classTeacherId: z
        .number()
        .positive('Class teacher ID must be a positive number'),
    classId: z.number(),
    subjectTeachers: z.record(z.number(), z.number()), // { subjectId: teacherId }
})

export type CreateSectionInput = z.infer<typeof CreateSectionSchema>

@Table({ tableName: 'sections' })
export class Section extends Model<CreateSectionInput> {
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

    @ForeignKey(() => Teacher)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    classTeacherId!: number

    @BelongsTo(() => Teacher)
    classTeacher!: Teacher

    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    subjectTeachers!: Record<number, number>

    @ForeignKey(() => Class)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    classId!: number

    @BelongsTo(() => Class)
    class!: Class

    @HasMany(() => Subject)
    subjects!: Subject[]
}
