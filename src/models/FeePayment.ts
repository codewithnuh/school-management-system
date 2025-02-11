import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript'
import { z } from 'zod'
import { FeeStructure, StudentFeeAllocation } from '@/models/index.js'

export const feePaymentSchema = z.object({
    studentFeeAllocationId: z.number().int().positive({
        message: 'Student Fee Allocation ID must be a positive integer',
    }),
    paymentDate: z.date().transform(val => new Date(val)),
    paymentMethod: z.enum(
        ['Cash', 'Cheque', 'Online', 'Bank Transfer', 'POS'],
        {
            required_error: 'Payment method is required',
        },
    ),
    amountPaid: z
        .number()
        .positive({ message: 'Amount Paid must be positive' }),
    receiptNumber: z.string().min(1, { message: 'Receipt number is required' }),
    transactionReference: z.string().optional().nullable(),
    paymentNotes: z.string().optional().nullable(),
})

export type FeePaymentAttributes = z.infer<typeof feePaymentSchema> & {
    feePaymentId?: number
    createdAt?: Date
    updatedAt?: Date
}

@Table({
    tableName: 'fee_payments',
    timestamps: true,
})
export class FeePayment
    extends Model<FeePaymentAttributes>
    implements FeePaymentAttributes
{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    feePaymentId!: number

    @ForeignKey(() => StudentFeeAllocation)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    studentFeeAllocationId!: number

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    paymentDate!: Date

    @Column({
        type: DataType.ENUM('Cash', 'Cheque', 'Online', 'Bank Transfer', 'POS'),
        allowNull: false,
    })
    paymentMethod!: 'Cash' | 'Cheque' | 'Online' | 'Bank Transfer' | 'POS'

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    amountPaid!: number

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    receiptNumber!: string

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    transactionReference?: string | null

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    paymentNotes?: string | null

    @CreatedAt
    createdAt!: Date

    @UpdatedAt
    updatedAt!: Date

    // Associations

    studentFeeAllocation!: StudentFeeAllocation

    @ForeignKey(() => FeeStructure)
    @Column({
        type: DataType.INTEGER, // Explicitly defining data type
        allowNull: false,
    })
    feeStructureId!: number

    feeStructure!: FeeStructure
}
