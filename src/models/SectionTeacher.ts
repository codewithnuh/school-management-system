import type { Optional } from 'sequelize'
import {
    Column,
    CreatedAt,
    DataType,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript'
import type { Section } from './Section.js'
import type { Subject } from './Subject.js'
import type { Teacher } from './Teacher.js'

export interface SectionTeacherAttributes {
    id: number
    sectionId: number
    teacherId: number
    subjectId: number
    isClassTeacher: boolean
    createdAt: Date
    updatedAt: Date
}

export type SectionTeacherCreationAttributes = Optional<
    SectionTeacherAttributes,
    'id' | 'isClassTeacher' | 'createdAt' | 'updatedAt'
>

@Table({ tableName: 'section_teachers', timestamps: true, underscored: true })
export class SectionTeacher extends Model<
    SectionTeacherAttributes,
    SectionTeacherCreationAttributes
> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id: number

    @Column({ type: DataType.INTEGER, allowNull: false, field: 'section_id' })
    declare sectionId: number

    @Column({ type: DataType.INTEGER, allowNull: false, field: 'teacher_id' })
    declare teacherId: number

    @Column({ type: DataType.INTEGER, allowNull: false, field: 'subject_id' })
    declare subjectId: number

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_class_teacher',
    })
    declare isClassTeacher: boolean

    @CreatedAt
    @Column({ field: 'created_at' })
    declare createdAt: Date

    @UpdatedAt
    @Column({ field: 'updated_at' })
    declare updatedAt: Date

    declare section?: Section
    declare teacher?: Teacher
    declare subject?: Subject
}
