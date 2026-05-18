import { Table, Column, Model, DataType, BelongsTo, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { z } from 'zod'

export const AcademicYearSchema = z.object({
  id: z.number().optional(),
  schoolId: z.number(),
  name: z.string().min(1, 'Academic year name is required'),
  startDate: z.date(),
  endDate: z.date(),
  isCurrent: z.boolean().default(false),
  isActive: z.boolean().default(true),
})

export type AcademicYearAttributes = z.infer<typeof AcademicYearSchema> & {
  id: number
  createdAt: Date
  updatedAt: Date
}

@Table({
  tableName: 'academic_years',
  timestamps: true,
  underscored: true,
})
export class AcademicYear extends Model<AcademicYearAttributes> implements AcademicYearAttributes {
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
    defaultValue: false,
    field: 'is_current',
  })
  isCurrent!: boolean

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

  // Associations will be defined in index.ts
}
