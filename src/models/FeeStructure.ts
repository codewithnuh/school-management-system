import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript'
import { z } from 'zod'
import { AcademicYear, Class, FeeCategory } from '@/models/index.js'

// Zod schema for FeeStructure creation
export const feeStructureSchema = z.object({
    academicYearId: z
        .number()
        .int()
        .positive({ message: 'Academic Year ID must be a positive integer' }),
    classId: z
        .number()
        .int()
        .positive({ message: 'Class ID must be a positive integer' }),
    feeCategoryId: z
        .number()
        .int()
        .positive({ message: 'Fee Category ID must be a positive integer' }),
    amount: z.number().positive({ message: 'Amount must be positive' }),
})

export type FeeStructureAttributes = z.infer<typeof feeStructureSchema> & {
    feeStructureId?: number // Auto-incrementing primary key
    createdAt?: Date
    updatedAt?: Date
}

@Table({
    tableName: 'fee_structures',
    timestamps: true,
})
export class FeeStructure
    extends Model<FeeStructureAttributes>
    implements FeeStructureAttributes
{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    feeStructureId!: number

    @ForeignKey(() => AcademicYear)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    academicYearId!: number

    @ForeignKey(() => Class)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    classId!: number

    @ForeignKey(() => FeeCategory)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    feeCategoryId!: number

    @Column({
        type: DataType.DECIMAL,
        allowNull: false,
    })
    amount!: number

    @CreatedAt
    createdAt!: Date

    @UpdatedAt
    updatedAt!: Date

    // Associations
    @BelongsTo(() => AcademicYear)
    academicYear!: AcademicYear

    @BelongsTo(() => Class)
    class!: Class

    @BelongsTo(() => FeeCategory)
    feeCategory!: FeeCategory
}
