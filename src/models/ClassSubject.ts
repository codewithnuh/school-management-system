import { Table, Column, Model, DataType, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { z } from 'zod'

export const ClassSubjectSchema = z.object({
  id: z.number().optional(),
  classId: z.number(),
  subjectId: z.number(),
  isCompulsory: z.boolean().default(true),
})

export type ClassSubjectAttributes = z.infer<typeof ClassSubjectSchema> & {
  id: number
  createdAt: Date
  updatedAt: Date
}

@Table({
  tableName: 'class_subjects',
  timestamps: true,
  underscored: true,
})
export class ClassSubject extends Model<ClassSubjectAttributes> implements ClassSubjectAttributes {
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
    unique: 'unique_class_subject',
  })
  classId!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'subject_id',
    unique: 'unique_class_subject',
  })
  subjectId!: number

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    field: 'is_compulsory',
  })
  isCompulsory!: boolean

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date
}
