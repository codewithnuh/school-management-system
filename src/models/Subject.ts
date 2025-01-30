// subject.model.ts
import {
    Table,
    Column,
    Model,
    DataType,
    Unique,
    HasMany,
} from 'sequelize-typescript'
import { z } from 'zod'
import { SectionTeacher } from './SectionTeacher'

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
})
export class Subject extends Model<SubjectAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id!: number
    // models/Subject.ts
    @HasMany(() => SectionTeacher)
    sectionTeachers!: SectionTeacher[]
    @Unique
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

    // Validation method using Zod schema
    static validateSubject(data: Partial<SubjectAttributes>) {
        return SubjectSchema.parse(data)
    }
}
