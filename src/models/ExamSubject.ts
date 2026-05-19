import { Table, Column, Model, DataType, BelongsTo, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { z } from 'zod'

export const ExamSubjectSchema = z.object({
  id: z.number().optional(),
  examId: z.number(),
  subjectId: z.number(),
  roomId: z.number().optional(),
  scheduledDate: z.date().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  maxMarks: z.number().min(0),
  passMarks: z.number().min(0).optional(),
})

export type ExamSubjectAttributes = z.infer<typeof ExamSubjectSchema> & {
  id: number
  createdAt: Date
  updatedAt: Date
}

@Table({
  tableName: 'exam_subjects',
  timestamps: true,
  underscored: true,
})
export class ExamSubject extends Model<ExamSubjectAttributes> implements ExamSubjectAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'exam_id',
  })
  examId!: number

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
    type: DataType.DATE,
    allowNull: true,
    field: 'scheduled_date',
  })
  scheduledDate!: Date | null

  @Column({
    type: DataType.TIME,
    allowNull: true,
    field: 'start_time',
  })
  startTime!: string | null

  @Column({
    type: DataType.TIME,
    allowNull: true,
    field: 'end_time',
  })
  endTime!: string | null

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'max_marks',
  })
  maxMarks!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'pass_marks',
  })
  passMarks!: number | null

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date
}
