// exam.model.ts
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
} from 'sequelize-typescript'
import { Section, Class } from '@/models/index.js'
import { ExamAttributes } from '@/schema/exam.schema.js'

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
    id!: number

    @Column({ type: DataType.STRING, allowNull: false })
    name!: string

    @Column({
        type: DataType.ENUM('Mid-Term', 'Final'),
        allowNull: false,
    })
    type!: 'Mid-Term' | 'Final'

    @Column({ type: DataType.DATEONLY, allowNull: false })
    date!: string

    @Column({ type: DataType.STRING, allowNull: false })
    academicYear!: string

    @ForeignKey(() => Class)
    @Column({ type: DataType.INTEGER, allowNull: false })
    classId!: number

    @ForeignKey(() => Section)
    @Column({ type: DataType.INTEGER, allowNull: true })
    sectionId!: number
}
