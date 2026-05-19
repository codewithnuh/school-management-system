import { Table, Column, Model, DataType, BelongsTo, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { z } from 'zod'

export const TimeSlotSchema = z.object({
  id: z.number().optional(),
  schoolId: z.number(),
  name: z.string().min(1, 'Time slot name is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  duration: z.number().min(1),
  dayOfWeek: z.number().min(0).max(6),
  isActive: z.boolean().default(true),
})

export type TimeSlotAttributes = z.infer<typeof TimeSlotSchema> & {
  id: number
  createdAt: Date
  updatedAt: Date
}

@Table({
  tableName: 'time_slots',
  timestamps: true,
  underscored: true,
})
export class TimeSlot extends Model<TimeSlotAttributes> implements TimeSlotAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'school_id',
  })
  schoolId!: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string

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
    defaultValue: 45,
  })
  duration!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'day_of_week',
    comment: '0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday',
  })
  dayOfWeek!: number

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  })
  isActive!: boolean

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date
}
