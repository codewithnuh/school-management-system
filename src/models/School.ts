import { Table, Column, Model, DataType, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { z } from 'zod'

// Zod schema for validation
export const SchoolSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'School name is required'),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  code: z.string().min(1, 'School code is required'),
  logo: z.string().url().optional(),
  establishedDate: z.date().optional(),
  isActive: z.boolean().default(true),
})

export type SchoolAttributes = z.infer<typeof SchoolSchema> & {
  id: number
  createdAt: Date
  updatedAt: Date
}

@Table({
  tableName: 'schools',
  timestamps: true,
  underscored: true,
})
export class School extends Model<SchoolAttributes> implements SchoolAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  address!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: { isEmail: true },
  })
  email!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  code!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  logo!: string | null

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'established_date',
  })
  establishedDate!: Date | null

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
