import { Table, Column, Model, DataType } from 'sequelize-typescript'
import { GradeAttributes } from '@/schema/grade.schema.js'

@Table({
    tableName: 'grades',
    timestamps: true,
})
export class Grade extends Model<GradeAttributes> implements GradeAttributes {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number

    @Column({ type: DataType.STRING, allowNull: false })
    grade!: string

    @Column({ type: DataType.INTEGER, allowNull: false })
    minMarks!: number

    @Column({ type: DataType.INTEGER, allowNull: false })
    maxMarks!: number
}
