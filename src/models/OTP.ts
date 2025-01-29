import { Table, Column, Model, DataType, Index } from 'sequelize-typescript'

@Table({
    tableName: 'otps',
    timestamps: true,
})
export class OTP extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    public id!: number

    @Column({
        type: DataType.STRING(6),
        allowNull: false,
    })
    public otp!: string

    @Index // ✅ Correct way to define an index in sequelize-typescript
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    public entityId!: number

    @Column({
        type: DataType.ENUM('ADMIN', 'TEACHER', 'STUDENT', 'PARENT'),
        allowNull: false,
    })
    public entityType!: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    public isUsed!: boolean

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    public expiresAt!: Date

    @Column({
        type: DataType.DATE,
    })
    public readonly createdAt!: Date

    @Column({
        type: DataType.DATE,
    })
    public readonly updatedAt!: Date
}
