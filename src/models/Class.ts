import { Table, Column, Model, DataType, BelongsTo, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { z } from 'zod'

export const ClassSchema = z.object({
  id: z.number().optional(),
  schoolId: z.number(),
  academicYearId: z.number(),
  name: z.string().min(1, 'Class name is required'),
  level: z.number().min(1).max(12),
  isActive: z.boolean().default(true),
})

export type ClassAttributes = z.infer<typeof ClassSchema> & {
  id: number
  createdAt: Date
  updatedAt: Date
}

@Table({
  tableName: 'classes',
  timestamps: true,
  underscored: true,
})
export class Class extends Model<ClassAttributes> implements ClassAttributes {
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
    type: DataType.INTEGER,
    allowNull: false,
  })
  level!: number

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
