import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript'
import { z } from 'zod'
import { Admin } from '@/models/index.js'
export const schoolSchema = z.object({
    id: z.number(),
    name: z.string(),
    brandColor: z.string(),
    description: z.string(),
    logo: z.string(),
})
type SchoolType = z.infer<typeof schoolSchema>
@Table({ tableName: 'schools', timestamps: true })
export class School extends Model<SchoolType> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number
    @Column({
        type: DataType.STRING,
    })
    name!: string
    @Column({
        type: DataType.STRING,
    })
    brandColor!: string

    @Column({
        type: DataType.STRING,
    })
    description!: string
    @ForeignKey(() => Admin)
    @Column({
        type: DataType.INTEGER,
    })
    adminId!: number
    @Column({
        type: DataType.STRING,
    })
    logo!: string
}
