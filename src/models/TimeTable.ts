// models/Timetable.ts
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript'
import { Section } from './Section'
import { TimeSlot } from './Timeslot'
import { Subject } from './Subject'
import { Teacher } from './Teacher'

@Table({ tableName: 'timetables' })
export class Timetable extends Model {
    @ForeignKey(() => Section)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    sectionId!: number

    @BelongsTo(() => Section)
    section!: Section

    @ForeignKey(() => TimeSlot)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    timeSlotId!: number

    @BelongsTo(() => TimeSlot)
    timeSlot!: TimeSlot

    @ForeignKey(() => Subject)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    subjectId!: number

    @BelongsTo(() => Subject)
    subject!: Subject

    @ForeignKey(() => Teacher)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    teacherId!: number

    @BelongsTo(() => Teacher)
    teacher!: Teacher

    @Column({
        type: DataType.STRING(20),
        allowNull: true,
    })
    roomNumber?: string
}
