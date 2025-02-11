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

export const feeStructureSchema = z.object({
    academicYearId: z.number().int().positive(),
    classId: z.number().int().positive(),
    feeCategoryId: z.number().int().positive(),
    amount: z.number().positive(),
})

export type FeeStructureAttributes = z.infer<typeof feeStructureSchema> & {
    feeStructureId?: number
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
    amount!: number

    @CreatedAt
    createdAt!: Date

    @UpdatedAt
    updatedAt!: Date

    @ForeignKey(() => AcademicYear)
    @Column({
        type: DataType.INTEGER, // Explicitly defining the data type
        allowNull: false,
    })
    academicYearId!: number

    @BelongsTo(() => AcademicYear, { as: 'academicYear' })
    academicYear!: AcademicYear

    @ForeignKey(() => FeeCategory)
    @Column({
        type: DataType.INTEGER, // Explicitly defining the data type
        allowNull: false,
    })
    feeCategoryId!: number

    @BelongsTo(() => FeeCategory)
    feeCategory!: FeeCategory
}
