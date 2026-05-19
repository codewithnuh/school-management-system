import { Table, Column, Model, DataType, BelongsTo, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { z } from 'zod'

export const ParentSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  guardianName: z.string().optional(),
  fatherPhone: z.string().optional(),
  motherPhone: z.string().optional(),
  guardianPhone: z.string().optional(),
  fatherOccupation: z.string().optional(),
  motherOccupation: z.string().optional(),
  guardianOccupation: z.string().optional(),
  annualIncome: z.number().optional(),
  isActive: z.boolean().default(true),
})

export type ParentAttributes = z.infer<typeof ParentSchema> & {
  id: number
  createdAt: Date
  updatedAt: Date
}

@Table({
  tableName: 'parents',
  timestamps: true,
  underscored: true,
})
export class Parent extends Model<ParentAttributes> implements ParentAttributes {
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
    type: DataType.STRING,
    allowNull: true,
    field: 'father_name',
  })
  fatherName!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'mother_name',
  })
  motherName!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'guardian_name',
  })
  guardianName!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'father_phone',
  })
  fatherPhone!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'mother_phone',
  })
  motherPhone!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'guardian_phone',
  })
  guardianPhone!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'father_occupation',
  })
  fatherOccupation!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'mother_occupation',
  })
  motherOccupation!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'guardian_occupation',
  })
  guardianOccupation!: string | null

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    field: 'annual_income',
  })
  annualIncome!: number | null

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
