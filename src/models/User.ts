import { Table, Column, Model, DataType, HasOne, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { z } from 'zod'

export const UserSchema = z.object({
  id: z.number().optional(),
  email: z.string().email('Invalid email address'),
  passwordHash: z.string().nullable().optional(),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']),
  schoolId: z.number(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
  isActive: z.boolean().default(true),
  isVerified: z.boolean().default(false),
  lastLoginAt: z.date().optional().nullable(),
})

export type UserAttributes = z.infer<typeof UserSchema> & {
  id: number
  createdAt: Date
  updatedAt: Date
}

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class User extends Model<UserAttributes> implements UserAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  })
  email!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'password_hash',
  })
  passwordHash!: string | null

  @Column({
    type: DataType.ENUM('ADMIN', 'TEACHER', 'STUDENT', 'PARENT'),
    allowNull: false,
  })
  role!: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'school_id',
  })
  schoolId!: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'first_name',
  })
  firstName!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'last_name',
  })
  lastName!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar!: string | null

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  })
  isActive!: boolean

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'is_verified',
  })
  isVerified!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'last_login_at',
  })
  lastLoginAt!: Date | null

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date

  // Associations will be defined in index.ts
}
