import { Table, Column, Model, DataType, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { z } from 'zod'

export const StudentParentSchema = z.object({
  id: z.number().optional(),
  studentId: z.number(),
  parentId: z.number(),
  relationship: z.enum(['FATHER', 'MOTHER', 'GUARDIAN']),
  isPrimary: z.boolean().default(false),
})

export type StudentParentAttributes = z.infer<typeof StudentParentSchema> & {
  id: number
  createdAt: Date
  updatedAt: Date
}

@Table({
  tableName: 'student_parents',
  timestamps: true,
  underscored: true,
})
export class StudentParent extends Model<StudentParentAttributes> implements StudentParentAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'student_id',
    unique: 'unique_student_parent',
  })
  studentId!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'parent_id',
    unique: 'unique_student_parent',
  })
  parentId!: number

  @Column({
    type: DataType.ENUM('FATHER', 'MOTHER', 'GUARDIAN'),
    allowNull: false,
  })
  relationship!: 'FATHER' | 'MOTHER' | 'GUARDIAN'

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'is_primary',
  })
  isPrimary!: boolean

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date
}
