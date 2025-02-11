import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    HasMany,
} from 'sequelize-typescript'
import { z } from 'zod'
import { FeeStructure } from '@/models/index.js'

export const FeeCategorySchema = z.object({
    categoryName: z.string().min(1, { message: 'Category name is required' }),
    description: z.string().optional().nullable(),
})

export type FeeCategoryAttributes = z.infer<typeof FeeCategorySchema> & {
    feeCategoryId?: number
    createdAt?: Date
    updatedAt?: Date
}

@Table({
    tableName: 'fee_categories',
    timestamps: true,
})
export class FeeCategory
    extends Model<FeeCategoryAttributes>
    implements FeeCategoryAttributes
{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    feeCategoryId!: number

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    categoryName!: string

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description?: string | null

    @CreatedAt
    createdAt!: Date

    @UpdatedAt
    updatedAt!: Date

    @HasMany(() => FeeStructure)
    feeStructures!: FeeStructure[]
}
