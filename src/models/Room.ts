import { Column, DataType, Model, Table } from 'sequelize-typescript'
@Table({ tableName: 'rooms' })
export class Room extends Model {
    @Column({
        type: DataType.STRING(50),
        unique: true,
        allowNull: false,
    })
    name!: string

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    capacity!: number

    @Column({
        type: DataType.ENUM('CLASSROOM', 'LAB', 'AUDITORIUM'),
        defaultValue: 'CLASSROOM',
    })
    type!: string
}
