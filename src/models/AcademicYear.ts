import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    HasMany,
} from 'sequelize-typescript'
import { FeeStructure, StudentFeeAllocation } from '@/models/index.js' //Import StudentFeeAllocation Model
import { z } from 'zod'

// Zod schema for AcademicYear creation
export const academicYearSchema = z.object({
    year: z.string().min(1, { message: 'Year is required' }), //e.g., "2023-2024"
    description: z.string().optional().nullable(),
})

export type AcademicYearAttributes = z.infer<typeof academicYearSchema> & {
    academicYearId?: number // Auto-incrementing primary key
    createdAt?: Date
    updatedAt?: Date
}

@Table({
    tableName: 'academic_years',
    timestamps: true,
})
export class AcademicYear
    extends Model<AcademicYearAttributes>
    implements AcademicYearAttributes
{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    academicYearId!: number

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    year!: string

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description?: string | null

    @CreatedAt
    createdAt!: Date

    @UpdatedAt
    updatedAt!: Date

    //Associations
    @HasMany(() => FeeStructure)
    feeStructures?: FeeStructure[]

    @HasMany(() => StudentFeeAllocation)
    studentFeeAllocations?: StudentFeeAllocation[]
}
