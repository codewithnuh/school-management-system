// examSubject.model.ts
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
} from 'sequelize-typescript'
import { Exam, Subject } from '@/models/index.js'

import { ExamSubjectAttributes } from '@/schema/examSubject.schema.js'

@Table({
    tableName: 'exam_subjects',
    timestamps: true,
})
export class ExamSubject
    extends Model<ExamSubjectAttributes>
    implements ExamSubjectAttributes
{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number

    @ForeignKey(() => Exam)
    @Column({ type: DataType.INTEGER, allowNull: false })
    examId!: number

    @ForeignKey(() => Subject)
    @Column({ type: DataType.INTEGER, allowNull: false })
    subjectId!: number

    @Column({ type: DataType.INTEGER, allowNull: false })
    maxMarks!: number

    @Column({ type: DataType.INTEGER, allowNull: false })
    passMarks!: number
}
