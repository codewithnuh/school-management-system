import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript'
import { Timetable } from './TimeTable'
import { Section } from './section'
import { Subject } from './Subject'
import { Teacher } from './Teacher'

@Table({
    tableName: 'timetable_entries',
    timestamps: true,
})
export class TimetableEntry extends Model {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    })
    id!: number

    @ForeignKey(() => Timetable)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    timetableId!: number

    @BelongsTo(() => Timetable)
    timetable!: Timetable

    @ForeignKey(() => Section)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    sectionId!: number

    @BelongsTo(() => Section)
    section!: Section

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
        type: DataType.STRING,
        allowNull: false,
    })
    dayOfWeek!: string

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    periodNumber!: number

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    startTime!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    endTime!: string
}
