import { Table, Column, Model, DataType, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { z } from 'zod'

export const TimetableEntrySchema = z.object({
  id: z.number().optional(),
  timetableId: z.number(),
  teacherId: z.number(),
  subjectId: z.number(),
  roomId: z.number().optional(),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  periodNumber: z.number().min(1),
})

export type TimetableEntryAttributes = z.infer<typeof TimetableEntrySchema> & {
  id: number
  createdAt: Date
  updatedAt: Date
}

@Table({
  tableName: 'timetable_entries',
  timestamps: true,
  underscored: true,
})
export class TimetableEntry extends Model<TimetableEntryAttributes> implements TimetableEntryAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'timetable_id',
  })
  timetableId!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'teacher_id',
  })
  teacherId!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'subject_id',
  })
  subjectId!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'room_id',
  })
  roomId!: number | null

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'day_of_week',
    comment: '0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday',
  })
  dayOfWeek!: number

  @Column({
    type: DataType.TIME,
    allowNull: false,
    field: 'start_time',
  })
  startTime!: string

  @Column({
    type: DataType.TIME,
    allowNull: false,
    field: 'end_time',
  })
  endTime!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'period_number',
  })
  periodNumber!: number

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date
}
