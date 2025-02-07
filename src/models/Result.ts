// result.model.ts
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript'
import { z } from 'zod'
import { Exam, User, Class } from '@/models/index.js' // Import necessary models

export const resultSchema = z.object({
    examId: z.number().int().positive(),
    studentId: z.number().int().positive(),
    classId: z.number().int().positive(),
    totalMarksObtained: z.number().nonnegative(), // Total marks across all subjects
    percentage: z.number().optional().nullable(),
    overallGrade: z.string().optional().nullable(), // Overall grade for the exam
    resultStatus: z.enum(['Pass', 'Fail', 'Pending']).default('Pending'), // Overall pass/fail status
    comments: z.string().optional().nullable(), // General comments on the result
})

export type ResultAttributes = z.infer<typeof resultSchema> & {
    resultId: number // Auto-incrementing primary key
    createdAt?: Date
    updatedAt?: Date
}

@Table({
    tableName: 'results',
    timestamps: true,
})
export class Result
    extends Model<ResultAttributes>
    implements ResultAttributes
{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    resultId!: number

    @ForeignKey(() => Exam)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    examId!: number

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    studentId!: number

    @ForeignKey(() => Class)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    classId!: number

    @Column({
        type: DataType.DECIMAL,
        allowNull: false,
    })
    totalMarksObtained!: number

    @Column({
        type: DataType.DECIMAL,
        allowNull: true,
    })
    percentage?: number | null

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    overallGrade?: string | null

    @Column({
        type: DataType.ENUM('Pass', 'Fail', 'Pending'),
        defaultValue: 'Pending', // Initially pending until result is fully processed
    })
    resultStatus!: 'Pass' | 'Fail' | 'Pending'

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    comments?: string | null

    @CreatedAt
    createdAt!: Date

    @UpdatedAt
    updatedAt!: Date

    // Associations
    @BelongsTo(() => Exam)
    exam!: Exam

    @BelongsTo(() => User)
    student!: User

    @BelongsTo(() => Class)
    class!: Class
}
