import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript'
import { User } from '@/models/index.js'

@Table({
    tableName: 'parents',
    timestamps: true,
})
export class Parent extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    firstName!: string

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    middleName?: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    lastName!: string

    @Column({
        type: DataType.STRING,
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
    address!: string
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: { isNumeric: true, len: [13, 13] },
    })
    guardianCNIC!: string

    @Column({
        type: DataType.STRING,
        allowNull: true,
        validate: { isNumeric: true, len: [10, 15] },
    })
    guardianPhone?: string
    @Column({
        type: DataType.STRING,
        allowNull: true,
        validate: { isEmail: true },
    })
    guardianEmail?: string

    @HasMany(() => User)
    users?: User[]
}
