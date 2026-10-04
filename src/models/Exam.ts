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

const examTypes = [
    'UNIT_TEST',
    'HALF_YEARLY',
    'ANNUAL',
    'QUARTERLY',
    'OTHER',
] as const

export const ExamInputSchema = z.object({
    schoolId: z.number().int().positive(),
    academicYearId: z.number().int().positive(),
    name: z.string().trim().min(1).max(120),
    type: z.enum(examTypes),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    isActive: z.boolean().default(true),
})

export const ExamSchema = ExamInputSchema.refine(
    value => value.endDate >= value.startDate,
    {
        path: ['endDate'],
        message: 'End date must be on or after the start date',
    },
)

export const examSchema = ExamSchema
export type ExamInput = z.output<typeof ExamSchema>

export interface ExamAttributes extends ExamInput {
    id: number
    createdAt: Date
    updatedAt: Date
}

export type ExamCreationAttributes = Optional<
    ExamAttributes,
    'id' | 'createdAt' | 'updatedAt'
>

@Table({ tableName: 'exams', timestamps: true, underscored: true })
export class Exam extends Model<ExamAttributes, ExamCreationAttributes> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id: number

    @Column({ type: DataType.INTEGER, allowNull: false, field: 'school_id' })
    declare schoolId: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'academic_year_id',
    })
    declare academicYearId: number

    @Column({ type: DataType.STRING(120), allowNull: false })
    declare name: string

    @Column({
        type: DataType.ENUM(...examTypes),
        allowNull: false,
        field: 'exam_type',
    })
    declare type: ExamInput['type']

    @Column({ type: DataType.DATE, allowNull: false, field: 'start_date' })
    declare startDate: Date

    @Column({ type: DataType.DATE, allowNull: false, field: 'end_date' })
    declare endDate: Date

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
    })
    declare isActive: boolean

    @CreatedAt
    @Column({ field: 'created_at' })
    declare createdAt: Date

    @UpdatedAt
    @Column({ field: 'updated_at' })
    declare updatedAt: Date
}
