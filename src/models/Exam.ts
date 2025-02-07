// exam.model.ts
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
    HasMany,
} from 'sequelize-typescript'
import { z } from 'zod'
import { Class, Section, StudentExam } from '@/models/index.js' // Import your existing models

// Zod schema for Exam creation (adjust as needed)
export const examSchema = z.object({
    examName: z.string().min(1, { message: 'Exam name is required' }),
    classId: z
        .number()
        .int()
        .positive({ message: 'Class ID must be a positive integer' }),
    sectionId: z.number().int().positive().optional().nullable(), // Optional section
    examDate: z.string().min(1, { message: 'Exam date is required' }), // Or z.date() if you want Date object
    totalMarks: z
        .number()
        .positive({ message: 'Total marks must be positive' }),
    passingMarks: z.number().positive().optional().nullable(),
    examType: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    isPublished: z.boolean().default(false),
})

export type ExamAttributes = z.infer<typeof examSchema> & {
    examId: number // Auto-incrementing primary key
    createdAt?: Date
    updatedAt?: Date
}

@Table({
    tableName: 'exams',
    timestamps: true,
})
export class Exam extends Model<ExamAttributes> implements ExamAttributes {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    examId!: number

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    examName!: string

    @ForeignKey(() => Class)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    classId!: number

    @ForeignKey(() => Section)
    @Column({
        type: DataType.INTEGER,
        allowNull: true, // Nullable for class-wide exams
    })
    sectionId?: number | null

    @Column({
        type: DataType.DATE, // Or DataType.STRING if you prefer string dates
        allowNull: false,
    })
    examDate!: string // Or Date

    @Column({
        type: DataType.DECIMAL,
        allowNull: false,
    })
    totalMarks!: number

    @Column({
        type: DataType.DECIMAL,
        allowNull: true,
    })
    passingMarks?: number | null

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    examType?: string | null

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description?: string | null

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    isPublished!: boolean

    @CreatedAt
    createdAt!: Date

    @UpdatedAt
    updatedAt!: Date

    // Associations
    @BelongsTo(() => Class)
    class!: Class

    @BelongsTo(() => Section)
    section!: Section

    @HasMany(() => StudentExam)
    studentExams!: StudentExam[]
}
