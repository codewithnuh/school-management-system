import {
    Table,
    Column,
    Model,
    DataType,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript'
import { z } from 'zod'

export const StudentExamSchema = z.object({
    id: z.number().optional(),
    studentId: z.number(),
    examSubjectId: z.number(),
    marksObtained: z.number().min(0).nullable().optional(),
    grade: z.string().nullable().optional(),
    remarks: z.string().nullable().optional(),
    evaluatedBy: z.number().nullable().optional(),
    evaluatedAt: z.date().nullable().optional(),
})

export type StudentExamAttributes = z.infer<typeof StudentExamSchema> & {
    id: number
    createdAt: Date
    updatedAt: Date
}

@Table({
    tableName: 'student_exams',
    timestamps: true,
    underscored: true,
})
export class StudentExam
    extends Model<StudentExamAttributes>
    implements StudentExamAttributes
{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'student_id',
    })
    studentId!: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'exam_subject_id',
    })
    examSubjectId!: number

    @Column({
        type: DataType.DECIMAL(5, 2),
        allowNull: true,
        field: 'marks_obtained',
    })
    marksObtained!: number | null

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    grade!: string | null

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    remarks!: string | null

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        field: 'evaluated_by',
    })
    evaluatedBy!: number | null

    @Column({
        type: DataType.DATE,
        allowNull: true,
        field: 'evaluated_at',
    })
    evaluatedAt!: Date | null

    @CreatedAt
    @Column({ type: DataType.DATE, field: 'created_at' })
    createdAt!: Date

    @UpdatedAt
    @Column({ type: DataType.DATE, field: 'updated_at' })
    updatedAt!: Date
}
