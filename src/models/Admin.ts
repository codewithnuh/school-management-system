import { DataTypes } from 'sequelize'
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
} from 'sequelize-typescript'
import { z } from 'zod'
import { School } from '@/models/index.js'

export const adminSchema = z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    email: z.string().email(),
    phoneNo: z.string(),
    password: z.string(),
    role: z.string(),
    isSubscriptionActive: z.boolean().default(false),
    subscriptionPlan: z.enum(['monthly', 'yearly']),
    schoolId: z.number().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

type AdminAttributes = z.infer<typeof adminSchema>

@Table({
    tableName: 'admins',
    timestamps: true,
})
export class Admin extends Model<AdminAttributes> implements AdminAttributes {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number

    @Column({ type: DataType.STRING, allowNull: false })
    firstName!: string

    @Column({ type: DataType.STRING })
    middleName?: string

    @Column({ type: DataType.STRING, allowNull: false })
    lastName!: string

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
    })
    email!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: { isNumeric: true, len: [10, 15] },
    })
    phoneNo!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string

    @Column({ type: DataType.STRING, allowNull: false })
    role!: string
    @ForeignKey(() => School)
    schoolId!: number
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isSubscriptionActive!: boolean
    @Column({ type: DataType.ENUM('monthly', 'yearly'), defaultValue: false })
    subscriptionPlan!: 'monthly' | 'yearly'
    @Column({ type: DataType.DATE, defaultValue: DataTypes.NOW() })
    createdAt?: Date

    @Column({ type: DataType.DATE, defaultValue: DataTypes.NOW() })
    updatedAt?: Date
}
