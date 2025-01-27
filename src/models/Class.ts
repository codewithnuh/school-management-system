import { Column, DataType, HasMany, Model } from 'sequelize-typescript'
import z from 'zod'
import { Section } from '@/models/section'
export const ClassSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    maxStudents: z.number(),
})

export type ClassAttributes = z.infer<typeof ClassSchema>
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
        type: DataType.NUMBER,
        allowNull: false,
    })
    maxStudents!: number
}
