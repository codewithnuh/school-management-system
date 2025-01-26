import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript'
import { User } from '@/models/User' // Import your User model

interface PasswordResetTokenAttributes {
    id?: number
    token: string
    userId: number
    expiryDate: Date
    createdAt?: Date
    updatedAt?: Date
}

@Table({
    tableName: 'password_reset_tokens', // Important: Use a descriptive table name
    timestamps: true, // Adds createdAt and updatedAt
})
export class PasswordResetToken
    extends Model<PasswordResetTokenAttributes>
    implements PasswordResetTokenAttributes
{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id?: number

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true, // Ensure tokens are unique
    })
    token!: string

    @ForeignKey(() => User) // Foreign key to User model
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId!: number

    @BelongsTo(() => User) // Define the relationship
    user!: User

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    expiryDate!: Date

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    createdAt?: Date

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    updatedAt?: Date
}
