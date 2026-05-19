import { Table, Column, Model, DataType, BelongsTo, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { z } from 'zod'

export const SectionSchema = z.object({
  id: z.number().optional(),
  classId: z.number(),
  name: z.string().min(1, 'Section name is required'),
  capacity: z.number().min(1),
  classTeacherId: z.number().optional(),
  isActive: z.boolean().default(true),
})

export type SectionAttributes = z.infer<typeof SectionSchema> & {
  id: number
  createdAt: Date
  updatedAt: Date
}

@Table({
  tableName: 'sections',
  timestamps: true,
  underscored: true,
})
export class Section extends Model<SectionAttributes> implements SectionAttributes {
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
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 40,
  })
  capacity!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'class_teacher_id',
  })
  classTeacherId!: number | null

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
