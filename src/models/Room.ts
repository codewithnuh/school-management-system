import { Table, Column, Model, DataType, BelongsTo, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { z } from 'zod'

export const RoomSchema = z.object({
  id: z.number().optional(),
  schoolId: z.number(),
  name: z.string().min(1, 'Room name is required'),
  capacity: z.number().min(1),
  type: z.enum(['CLASSROOM', 'LAB', 'COMPUTER_LAB', 'LIBRARY', 'AUDITORIUM', 'OTHER']),
  building: z.string().optional(),
  floor: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
})

export type RoomAttributes = z.infer<typeof RoomSchema> & {
  id: number
  createdAt: Date
  updatedAt: Date
}

@Table({
  tableName: 'rooms',
  timestamps: true,
  underscored: true,
})
export class Room extends Model<RoomAttributes> implements RoomAttributes {
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
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 40,
  })
  capacity!: number

  @Column({
    type: DataType.ENUM('CLASSROOM', 'LAB', 'COMPUTER_LAB', 'LIBRARY', 'AUDITORIUM', 'OTHER'),
    allowNull: false,
    defaultValue: 'CLASSROOM',
  })
  type!: 'CLASSROOM' | 'LAB' | 'COMPUTER_LAB' | 'LIBRARY' | 'AUDITORIUM' | 'OTHER'

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  building!: string | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  floor!: number | null

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
