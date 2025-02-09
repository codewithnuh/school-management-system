import {
    Table,
    Column,
    Model,
    DataType,
    BelongsToMany,
    HasMany,
} from 'sequelize-typescript'
import { z } from 'zod'
import { Class, StudentExam, ClassSubject } from '@/models/index.js'

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
    timestamps: true,
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

    // Many-to-Many relationship with Class
    @BelongsToMany(() => Class, () => ClassSubject)
    classes!: Class[]
    @HasMany(() => StudentExam)
    studentExams!: StudentExam[]
    // Validation method using Zod schema
    static validateSubject(data: Partial<SubjectAttributes>) {
        return SubjectSchema.parse(data)
    }
}
