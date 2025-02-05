import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
} from 'sequelize-typescript'
import { z } from 'zod'
import { Section } from '@/models/index.js'

// Zod schema for validation
export const SubjectSchema = z.object({
    id: z.number().optional(), // Optional for creation, auto-generated
    name: z
        .string()
        .min(1, 'Subject name cannot be empty')
        .max(100, 'Subject name cannot exceed 100 characters'),
    description: z.string().optional().nullable(),
})

// Type inference from Zod schema
export type SubjectAttributes = z.infer<typeof SubjectSchema>

@Table({
    tableName: 'subjects',
    timestamps: true, // Adds createdAt and updatedAt columns
    // Define a table-level unique index on 'name' to avoid duplicate keys issues and give explicit control over indexing
    indexes: [
        {
            unique: true,
            fields: ['name'],
            name: 'unique_subject_name',
        },
    ],
})
export class Subject extends Model<SubjectAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id!: number

    // Removed column-level @Unique decorator to prevent auto-creation
    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    name!: string

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description?: string

    @ForeignKey(() => Section)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    sectionId!: number

    // Validation method using Zod schema
    static validateSubject(data: Partial<SubjectAttributes>) {
        return SubjectSchema.parse(data)
    }
}
