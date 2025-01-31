// models/Timetable.ts
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    AfterDestroy,
    AfterUpdate,
} from 'sequelize-typescript'
import { Section } from './Section'
import { TimeSlot } from './TimeSlot'
import { Subject } from './Subject'
import { Teacher } from './Teacher'
import { TimetableService } from '@/services/timetable.service'
import { number } from 'zod'

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
    @AfterUpdate
    @AfterDestroy
    static async regenerateTimetable(timeSlot: TimeSlot) {
        const sectionIds = (
            await Timetable.findAll({
                where: { timeSlotId: timeSlot.id },
                attributes: ['sectionId'],
                group: ['sectionId'],
            })
        ).map(t => t.sectionId)

        // Regenerate timetable for affected sections
        await Promise.all(
            sectionIds.map((id: number) =>
                TimetableService.generateTimetable(id),
            ),
        )
    }
}
