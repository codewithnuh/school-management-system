// student-exam.model.ts
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
import {
    Exam,
    Section,
    User,
    Teacher,
    Subject,
    SectionTeacher,
} from '@/models/index.js' // Import your existing models

export const studentExamSchema = z.object({
    studentId: z.number().int().positive(),
    examId: z.number().int().positive(),
    sectionId: z.number().int().positive(),
    subjectId: z.number().int().positive(),
    marksObtained: z.number().optional().nullable(),
    grade: z.string().optional().nullable(),
    comments: z.string().optional().nullable(),
    markingTeacherId: z.number().int().positive().optional().nullable(),
    markingStatus: z.enum(['Pending', 'Completed']).default('Pending'),
})

export type StudentExamAttributes = z.infer<typeof studentExamSchema> & {
    studentExamId: number // Auto-incrementing primary key
    createdAt?: Date
    updatedAt?: Date
}
@Table({
    tableName: 'student_exams',
    timestamps: true,
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
    studentExamId!: number
    @ForeignKey(() => Exam)
    @Column({ type: DataType.INTEGER })
    examId!: number
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    studentId!: number

    @ForeignKey(() => Section)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    sectionId!: number
    @ForeignKey(() => SectionTeacher) // Add this line
    @Column({ type: DataType.INTEGER })
    sectionTeacherId!: number
    @ForeignKey(() => Subject)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    subjectId!: number

    @Column({
        type: DataType.DECIMAL,
        allowNull: true,
    })
    marksObtained?: number | null

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    grade?: string | null

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    comments?: string | null

    @ForeignKey(() => Teacher)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    markingTeacherId?: number | null

    @Column({
        type: DataType.ENUM('Pending', 'Completed'),
        defaultValue: 'Pending',
    })
    markingStatus!: 'Pending' | 'Completed'
    markingCompletionStatus!: 'Pending' | 'Completed' // Added to satisfy Typescript - will use markingStatus in code

    @CreatedAt
    createdAt!: Date

    @UpdatedAt
    updatedAt!: Date

    // Associations
    @BelongsTo(() => User)
    student!: User

    @BelongsTo(() => Exam)
    exam!: Exam

    @BelongsTo(() => Section)
    section!: Section
    @BelongsTo(() => SectionTeacher)
    sectionTeacher!: SectionTeacher
    @BelongsTo(() => Subject)
    subject!: Subject

    @BelongsTo(() => Teacher)
    markingTeacher!: Teacher
}
