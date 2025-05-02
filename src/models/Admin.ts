import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
} from 'sequelize-typescript'
import { z } from 'zod'

export const adminSchema = z.object({
    id: z.number().optional(),
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    email: z.string().email(),
    phoneNo: z.string().optional(),
    password: z.string(),
    entityType: z.enum(['ADMIN']).default('ADMIN'),
    isSubscriptionActive: z.boolean().default(false),
    subscriptionPlan: z.enum(['monthly', 'yearly']).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

type AdminAttributes = z.infer<typeof adminSchema>

@Table({
    tableName: 'admins',
    timestamps: true,
})
export class Admin extends Model<AdminAttributes> implements AdminAttributes {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number

    @Column(DataType.STRING)
    firstName!: string

    @Column(DataType.STRING)
    middleName?: string

    @Column(DataType.STRING)
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
        allowNull: true,
        validate: { isNumeric: true, len: [10, 15] },
    })
    phoneNo?: string

    @Column(DataType.STRING)
    password!: string

    @Column(DataType.STRING)
    entityType!: 'ADMIN'

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isSubscriptionActive!: boolean

    @Column({ type: DataType.ENUM('monthly', 'yearly') })
    subscriptionPlan?: 'monthly' | 'yearly'

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW() })
    createdAt?: Date

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW() })
    updatedAt?: Date
}
