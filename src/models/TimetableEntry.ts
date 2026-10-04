import type { Optional } from 'sequelize'
import {
    Column,
    CreatedAt,
    DataType,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript'
import type { Room } from './Room.js'
import type { Subject } from './Subject.js'
import type { Teacher } from './Teacher.js'
import type { Timetable } from './Timetable.js'

export const WEEKDAYS = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
] as const

export type TimetableDay = (typeof WEEKDAYS)[number]

export interface TimetableEntryAttributes {
    id: number
    timetableId: number
    teacherId: number
    subjectId: number
    dayOfWeek: TimetableDay
    periodNumber: number
    roomId: number | null
    isSubstitute: boolean
    notes: string | null
    createdAt: Date
    updatedAt: Date
}

export type TimetableEntryCreationAttributes = Optional<
    TimetableEntryAttributes,
    | 'id'
    | 'roomId'
    | 'isSubstitute'
    | 'notes'
    | 'createdAt'
    | 'updatedAt'
>

@Table({
    tableName: 'timetable_entries',
    timestamps: true,
    underscored: true,
})
export class TimetableEntry extends Model<
    TimetableEntryAttributes,
    TimetableEntryCreationAttributes
> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'timetable_id',
    })
    declare timetableId: number

    @Column({ type: DataType.INTEGER, allowNull: false, field: 'teacher_id' })
    declare teacherId: number

    @Column({ type: DataType.INTEGER, allowNull: false, field: 'subject_id' })
    declare subjectId: number

    @Column({
        type: DataType.ENUM(...WEEKDAYS),
        allowNull: false,
        field: 'day_of_week',
    })
    declare dayOfWeek: TimetableDay

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'period_number',
    })
    declare periodNumber: number

    @Column({ type: DataType.INTEGER, allowNull: true, field: 'room_id' })
    declare roomId: number | null

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_substitute',
    })
    declare isSubstitute: boolean

    @Column({ type: DataType.TEXT, allowNull: true })
    declare notes: string | null

    @CreatedAt
    @Column({ field: 'created_at' })
    declare createdAt: Date

    @UpdatedAt
    @Column({ field: 'updated_at' })
    declare updatedAt: Date

    declare timetable?: Timetable
    declare teacher?: Teacher
    declare subject?: Subject
    declare room?: Room
}
