import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    CreatedAt,
    UpdatedAt,
    Unique,
    AutoIncrement,
} from 'sequelize-typescript'
import { z } from 'zod'
export const ownerSchema = z.object({
    id: z.number().optional(),
    email: z.string().email(),
    password: z.string(),
    fullName: z.string().optional(),
    phone: z.string().optional(),
    isSuperAdmin: z.boolean().default(true),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

type OwnerAttributes = z.infer<typeof ownerSchema>

@Table({
    tableName: 'owners',
    timestamps: true,
})
export class Owner extends Model<OwnerAttributes> implements OwnerAttributes {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number

    @Unique
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: { isEmail: true },
    })
    email!: string

    @Column({ type: DataType.STRING, allowNull: false })
    password!: string // Make sure to hash this using bcrypt before saving

    @Column({ type: DataType.STRING, allowNull: false })
    fullName!: string

    @Column({ type: DataType.STRING, allowNull: true })
    phone?: string

    @Default(true)
    @Column(DataType.BOOLEAN)
    isSuperAdmin!: boolean
    @CreatedAt
    createdAt!: Date

    @UpdatedAt
    updatedAt!: Date
}
