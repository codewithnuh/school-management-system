// result.model.ts
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
} from 'sequelize-typescript'
import { ExamSubject, User } from '@/models/index.js'
import { ResultAttributes } from '@/schema/result.schema.js'

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
    id!: number

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    studentId!: number

    @ForeignKey(() => ExamSubject)
    @Column({ type: DataType.INTEGER, allowNull: false })
    examSubjectId!: number

    @Column({ type: DataType.INTEGER, allowNull: false })
    marksObtained!: number
}
