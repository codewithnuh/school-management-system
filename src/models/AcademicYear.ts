import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    HasMany,
} from 'sequelize-typescript'
import { FeeStructure, StudentFeeAllocation } from '@/models/index.js'
import { z } from 'zod'

export const academicYearSchema = z.object({
    year: z.string().min(1, { message: 'Year is required' }),
    description: z.string().optional().nullable(),
})

export type AcademicYearAttributes = z.infer<typeof academicYearSchema> & {
    academicYearId?: number
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

    academicYearFeeStructures!: FeeStructure[]

    studentFeeAllocations?: StudentFeeAllocation[]
}
