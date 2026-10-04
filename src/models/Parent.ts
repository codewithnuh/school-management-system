import {
    Table,
    Column,
    Model,
    DataType,
    BelongsTo,
    HasMany,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript'
import { z } from 'zod'

export const ParentSchema = z.object({
    id: z.number().optional(),
    userId: z.number(),
    fatherName: z.string().nullable().optional(),
    motherName: z.string().nullable().optional(),
    guardianName: z.string().nullable().optional(),
    fatherPhone: z.string().nullable().optional(),
    motherPhone: z.string().nullable().optional(),
    guardianPhone: z.string().nullable().optional(),
    fatherOccupation: z.string().nullable().optional(),
    motherOccupation: z.string().nullable().optional(),
    guardianOccupation: z.string().nullable().optional(),
    annualIncome: z.number().nullable().optional(),
    isActive: z.boolean().default(true),
})

export type ParentAttributes = z.infer<typeof ParentSchema> & {
    id: number
    createdAt: Date
    updatedAt: Date
}

@Table({
    tableName: 'parents',
    timestamps: true,
    underscored: true,
})
export class Parent
    extends Model<ParentAttributes>
    implements ParentAttributes
{
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
        type: DataType.STRING,
        allowNull: true,
        field: 'father_name',
    })
    fatherName!: string | null

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'mother_name',
    })
    motherName!: string | null

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'guardian_name',
    })
    guardianName!: string | null

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'father_phone',
    })
    fatherPhone!: string | null

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'mother_phone',
    })
    motherPhone!: string | null

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'guardian_phone',
    })
    guardianPhone!: string | null

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'father_occupation',
    })
    fatherOccupation!: string | null

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'mother_occupation',
    })
    motherOccupation!: string | null

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'guardian_occupation',
    })
    guardianOccupation!: string | null

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: true,
        field: 'annual_income',
    })
    annualIncome!: number | null

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
    })
    isActive!: boolean

    @CreatedAt
    @Column({ type: DataType.DATE, field: 'created_at' })
    createdAt!: Date

    @UpdatedAt
    @Column({ type: DataType.DATE, field: 'updated_at' })
    updatedAt!: Date
}
