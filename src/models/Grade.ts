// grade.model.ts
import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript'
import { z } from 'zod'

// Zod schema for Grade creation and validation
export const gradeSchema = z.object({
    gradeName: z.string().min(1, { message: 'Grade name is required' }).max(10), // e.g., "A+", "A", "B", "Fail"
    lowerPercentage: z.number().min(0).max(100), // Lower bound of percentage range
    upperPercentage: z.number().min(0).max(100), // Upper bound of percentage range
    description: z.string().optional().nullable(), // Optional description of the grade
})

export type GradeAttributes = z.infer<typeof gradeSchema> & {
    gradeId?: number // Auto-incrementing primary key
    createdAt?: Date
    updatedAt?: Date
}

@Table({
    tableName: 'grades',
    timestamps: true,
})
export class Grade extends Model<GradeAttributes> implements GradeAttributes {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    gradeId!: number

    @Column({
        type: DataType.STRING(10),
        allowNull: false,
        unique: true, // Ensure grade names are unique (e.g., only one 'A+')
    })
    gradeName!: string

    @Column({
        type: DataType.DECIMAL, // Store percentage as decimal
        allowNull: false,
    })
    lowerPercentage!: number

    @Column({
        type: DataType.DECIMAL,
        allowNull: false,
    })
    upperPercentage!: number

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description?: string | null

    @CreatedAt
    createdAt!: Date

    @UpdatedAt
    updatedAt!: Date
}
