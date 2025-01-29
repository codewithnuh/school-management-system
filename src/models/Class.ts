import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import z from 'zod'
import { Section } from '@/models/Section'
export const ClassSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    description: z.string(),
    maxStudents: z.number(),
})

export type ClassAttributes = z.infer<typeof ClassSchema>
@Table({
    tableName: 'classes',
    timestamps: true,
})
export class Class extends Model<ClassAttributes> implements ClassAttributes {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    })
    id!: number
    @HasMany(() => Section)
    sections?: Section[]
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    description!: string
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    maxStudents!: number
    @Column({
        type: DataType.DATE,
    })
    createdAt?: Date
    @Column({
        type: DataType.DATE,
    })
    updatedAt?: Date
}
