import { AutoIncrement, BelongsTo, Model } from 'sequelize-typescript'
import { Table, Column, DataType, ForeignKey } from 'sequelize-typescript'
import { z } from 'zod'
import { Class } from '@/models/class'
import { Teacher } from '@/models/Teacher'

export const SectionSchema = z.object({
    id: z.number().optional(),
    name: z
        .string()
        .length(1, 'Section name must be a single character')
        .regex(/^[A-H]$/, 'Section name must be a letter from A to H'),
    classId: z.number().positive('Class ID must be a positive number'),
    classTeacherId: z.number(),
})

export type SectionAttributes = z.infer<typeof SectionSchema>

@Table({
    tableName: 'sections',
    timestamps: true,
})
export class Section extends Model<SectionAttributes> {
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id!: number

    @Column({
        type: DataType.STRING(1),
        allowNull: false,
        validate: {
            isIn: [['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']],
        },
    })
    name!: string

    @ForeignKey(() => Class)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: 'classes',
            key: 'id',
        },
    })
    classId!: number

    @BelongsTo(() => Class)
    class!: Class
    @Column({
        type: DataType.NUMBER,
        allowNull: false,
        validate: {
            isNumeric: true,
        },
    })
    @BelongsTo(() => Teacher)
    classTeacherId!: number
    static validateSection(data: Partial<SectionAttributes>) {
        return SectionSchema.parse(data)
    }
}
