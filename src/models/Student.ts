import { Table, Column, Model, DataType, BelongsTo, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { z } from 'zod'

export const StudentSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  schoolId: z.number(),
  classId: z.number(),
  sectionId: z.number(),
  admissionNumber: z.string().min(1, 'Admission number is required'),
  rollNumber: z.number().min(1),
  dateOfBirth: z.date(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.string().optional(),
  nationality: z.string().optional(),
  religion: z.string().optional(),
  caste: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  admissionDate: z.date().optional(),
  isActive: z.boolean().default(true),
})

export type StudentAttributes = z.infer<typeof StudentSchema> & {
  id: number
  createdAt: Date
  updatedAt: Date
}

@Table({
  tableName: 'students',
  timestamps: true,
  underscored: true,
})
export class Student extends Model<StudentAttributes> implements StudentAttributes {
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
    type: DataType.STRING,
    allowNull: false,
    field: 'admission_number',
    unique: 'unique_school_admission',
  })
  admissionNumber!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'roll_number',
  })
  rollNumber!: number

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'date_of_birth',
  })
  dateOfBirth!: Date

  @Column({
    type: DataType.ENUM('MALE', 'FEMALE', 'OTHER'),
    allowNull: false,
  })
  gender!: 'MALE' | 'FEMALE' | 'OTHER'

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'blood_group',
  })
  bloodGroup!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  nationality!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  religion!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  caste!: string | null

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  address!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  city!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  state!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  pincode!: string | null

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'admission_date',
  })
  admissionDate!: Date | null

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
