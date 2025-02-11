import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
    HasMany,
} from 'sequelize-typescript'
import { z } from 'zod'
import {
    User,
    AcademicYear,
    Class,
    FeePayment,
    FeeCategory,
} from '@/models/index.js'

// Zod schema for StudentFeeAllocation creation
export const StudentFeeAllocationSchema = z.object({
    studentId: z
        .number()
        .int()
        .positive({ message: 'Student ID must be a positive integer' }),
    academicYearId: z
        .number()
        .int()
        .positive({ message: 'Academic Year ID must be a positive integer' }),
    classId: z
        .number()
        .int()
        .positive({ message: 'Class ID must be a positive integer' }),
    totalFeeAmount: z
        .number()
        .positive({ message: 'Total Fee Amount must be positive' }),
    outstandingBalance: z
        .number()
        .nonnegative({ message: 'Outstanding Balance cannot be negative' }), // Can be zero
})

export type StudentFeeAllocationAttributes = z.infer<
    typeof StudentFeeAllocationSchema
> & {
    studentFeeAllocationId?: number // Auto-incrementing primary key
    createdAt?: Date
    updatedAt?: Date
}

@Table({
    tableName: 'student_fee_allocations',
    timestamps: true,
})
export class StudentFeeAllocation
    extends Model<StudentFeeAllocationAttributes>
    implements StudentFeeAllocationAttributes
{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    studentFeeAllocationId!: number

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    studentId!: number

    @ForeignKey(() => Class)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    classId!: number

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    totalFeeAmount!: number

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0, // Initialize at 0.00
    })
    outstandingBalance!: number

    @CreatedAt
    createdAt!: Date

    @UpdatedAt
    updatedAt!: Date

    // Associations
    @BelongsTo(() => User)
    student!: User

    @BelongsTo(() => Class)
    class!: Class

    @HasMany(() => FeePayment)
    feePayments?: FeePayment[]

    @ForeignKey(() => AcademicYear)
    @Column({
        type: DataType.INTEGER, // Explicitly defining the data type
        allowNull: false,
    })
    academicYearId!: number

    @BelongsTo(() => AcademicYear, { as: 'allocatedAcademicYear' })
    academicYear!: AcademicYear

    @ForeignKey(() => FeeCategory)
    @Column({
        type: DataType.INTEGER, // Explicitly defining the data type
        allowNull: false,
    })
    feeCategoryId!: number

    @BelongsTo(() => FeeCategory, { as: 'allocatedFeeCategory' })
    feeCategory!: FeeCategory
}
