import { AutoIncrement, BelongsTo, HasMany, Model } from 'sequelize-typescript'
import { Table, Column, DataType, ForeignKey } from 'sequelize-typescript'
import { number, z } from 'zod'
import { Class } from '@/models/Class'
import { Teacher } from '@/models/Teacher'
import { Timetable } from './TimeTable'

export const SectionSchema = z.object({
    id: z.number().optional(),
    name: z
        .string()
        .length(1, 'Section name must be a single character')
        .regex(/^[A-H]$/, 'Section name must be a letter from A to H'),
    classId: z.number().positive('Class ID must be a positive number'),
})

export type SectionAttributes = z.infer<typeof SectionSchema> & {
    classTeacherId: number | null
}

@Table({
    tableName: 'sections',
    timestamps: true,
    paranoid: true, // Enable soft deletes
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
    @ForeignKey(() => Teacher)
    @Column({
        type: DataType.INTEGER, // Corrected data type
        allowNull: false,
        references: {
            model: 'teachers',
            key: 'id',
        },
    })
    classTeacherId!: number
    @HasMany(() => Timetable)
    timetables!: Timetable[]
    static validateSection(data: Partial<SectionAttributes>) {
        return SectionSchema.parse(data)
    }
}
