import { Table, Column, Model, DataType, BelongsTo, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { z } from 'zod'

export const TeacherSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  schoolId: z.number(),
  employeeId: z.string().min(1, 'Employee ID is required'),
  qualification: z.string().optional(),
  experience: z.number().min(0).default(0),
  specialization: z.string().optional(),
  dateOfJoining: z.date().optional(),
  isActive: z.boolean().default(true),
})

export type TeacherAttributes = z.infer<typeof TeacherSchema> & {
  id: number
  createdAt: Date
  updatedAt: Date
}

@Table({
  tableName: 'teachers',
  timestamps: true,
  underscored: true,
})
export class Teacher extends Model<TeacherAttributes> implements TeacherAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id',
    unique: true,
  })
  userId!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'school_id',
  })
  schoolId!: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'employee_id',
    unique: 'unique_school_employee',
  })
  employeeId!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  qualification!: string | null

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  experience!: number

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  specialization!: string | null

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'date_of_joining',
  })
  dateOfJoining!: Date | null

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
