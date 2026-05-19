import { Table, Column, Model, DataType, BelongsTo, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { z } from 'zod'

export const ExamSchema = z.object({
  id: z.number().optional(),
  schoolId: z.number(),
  academicYearId: z.number(),
  name: z.string().min(1, 'Exam name is required'),
  type: z.enum(['UNIT_TEST', 'HALF_YEARLY', 'YEARLY', 'QUARTERLY', 'OTHER']),
  startDate: z.date(),
  endDate: z.date(),
  isActive: z.boolean().default(true),
})

export type ExamAttributes = z.infer<typeof ExamSchema> & {
  id: number
  createdAt: Date
  updatedAt: Date
}

@Table({
  tableName: 'exams',
  timestamps: true,
  underscored: true,
})
export class Exam extends Model<ExamAttributes> implements ExamAttributes {
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
    type: DataType.INTEGER,
    allowNull: false,
    field: 'academic_year_id',
  })
  academicYearId!: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string

  @Column({
    type: DataType.ENUM('UNIT_TEST', 'HALF_YEARLY', 'YEARLY', 'QUARTERLY', 'OTHER'),
    allowNull: false,
  })
  type!: 'UNIT_TEST' | 'HALF_YEARLY' | 'YEARLY' | 'QUARTERLY' | 'OTHER'

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'start_date',
  })
  startDate!: Date

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'end_date',
  })
  endDate!: Date

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
