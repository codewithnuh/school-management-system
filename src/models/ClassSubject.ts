import type { Optional } from 'sequelize'
import {
    Column,
    CreatedAt,
    DataType,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript'
import type { Class } from './Class.js'
import type { Subject } from './Subject.js'

export interface ClassSubjectAttributes {
    id: number
    classId: number
    subjectId: number
    periodsPerWeek: number
    isCompulsory: boolean
    createdAt: Date
    updatedAt: Date
}

export type ClassSubjectCreationAttributes = Optional<
    ClassSubjectAttributes,
    'id' | 'periodsPerWeek' | 'isCompulsory' | 'createdAt' | 'updatedAt'
>

@Table({ tableName: 'class_subjects', timestamps: true, underscored: true })
export class ClassSubject extends Model<
    ClassSubjectAttributes,
    ClassSubjectCreationAttributes
> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id: number

    @Column({ type: DataType.INTEGER, allowNull: false, field: 'class_id' })
    declare classId: number

    @Column({ type: DataType.INTEGER, allowNull: false, field: 'subject_id' })
    declare subjectId: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 4,
        field: 'periods_per_week',
    })
    declare periodsPerWeek: number

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_compulsory',
    })
    declare isCompulsory: boolean

    @CreatedAt
    @Column({ field: 'created_at' })
    declare createdAt: Date

    @UpdatedAt
    @Column({ field: 'updated_at' })
    declare updatedAt: Date

    declare class?: Class

    declare subject?: Subject
}
