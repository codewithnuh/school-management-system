import { Table, Column, Model, DataType, BelongsTo, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { z } from 'zod'

export const TimetableSchema = z.object({
  id: z.number().optional(),
  classId: z.number(),
  sectionId: z.number(),
  academicYearId: z.number(),
  name: z.string().min(1, 'Timetable name is required'),
  isValidFrom: z.date(),
  isValidTo: z.date(),
  isActive: z.boolean().default(true),
})

export type TimetableAttributes = z.infer<typeof TimetableSchema> & {
  id: number
  createdAt: Date
  updatedAt: Date
}

@Table({
  tableName: 'timetables',
  timestamps: true,
  underscored: true,
})
export class Timetable extends Model<TimetableAttributes> implements TimetableAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'class_id',
  })
  classId!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'section_id',
  })
  sectionId!: number

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
    type: DataType.DATE,
    allowNull: false,
    field: 'is_valid_from',
  })
  isValidFrom!: Date

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'is_valid_to',
  })
  isValidTo!: Date

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
