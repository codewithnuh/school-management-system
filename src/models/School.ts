import {
    BeforeCreate,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript'
import { z } from 'zod'
import { Admin } from '@/models/index.js'
import { nanoid } from 'nanoid'
export const schoolSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    brandColor: z.string(),
    description: z.string(),
    logo: z.string(),
    adminId: z.number(),
    code: z.string().optional(),
})
export type SchoolType = z.infer<typeof schoolSchema>
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
    @Column({
        type: DataType.STRING,
        unique: true,
    })
    code!: string
    // Auto-generate unique code before school is created
    @BeforeCreate
    static async generateCode(instance: School) {
        let code: string
        let exists: School | null

        do {
            code = `scl_${nanoid(6)}`
            exists = await School.findOne({ where: { code } })
        } while (exists)

        instance.code = code
    }
}
