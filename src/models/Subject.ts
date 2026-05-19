import { Table, Column, Model, DataType, BelongsTo, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { z } from 'zod'

export const SubjectSchema = z.object({
  id: z.number().optional(),
  schoolId: z.number(),
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  description: z.string().optional(),
  category: z.enum(['CORE', 'ELECTIVE', 'EXTRA_CURRICULAR']),
  credits: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
})

export type SubjectAttributes = z.infer<typeof SubjectSchema> & {
  id: number
  createdAt: Date
  updatedAt: Date
}

@Table({
  tableName: 'subjects',
  timestamps: true,
  underscored: true,
})
export class Subject extends Model<SubjectAttributes> implements SubjectAttributes {
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
    type: DataType.STRING,
    allowNull: false,
    unique: 'unique_school_subject_code',
  })
  code!: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string | null

  @Column({
    type: DataType.ENUM('CORE', 'ELECTIVE', 'EXTRA_CURRICULAR'),
    allowNull: false,
    defaultValue: 'CORE',
  })
  category!: 'CORE' | 'ELECTIVE' | 'EXTRA_CURRICULAR'

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  credits!: number

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
