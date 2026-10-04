import type { Optional } from 'sequelize'
import {
    Column,
    CreatedAt,
    DataType,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript'
import type { AcademicYear } from './AcademicYear.js'
import type { Class } from './Class.js'
import type { Section } from './Section.js'
import type { TimetableEntry } from './TimetableEntry.js'

export interface TimetableAttributes {
    id: number
    classId: number
    sectionId: number
    academicYearId: number
    name: string
    periodsPerDay: number
    periodsPerDayOverrides: Record<string, number> | null
    breakStartTime: string | null
    breakEndTime: string | null
    isActive: boolean
    version: number
    generatedBy: number | null
    createdAt: Date
    updatedAt: Date
}

export type TimetableCreationAttributes = Optional<
    TimetableAttributes,
    | 'id'
    | 'periodsPerDay'
    | 'periodsPerDayOverrides'
    | 'breakStartTime'
    | 'breakEndTime'
    | 'isActive'
    | 'version'
    | 'generatedBy'
    | 'createdAt'
    | 'updatedAt'
>

@Table({ tableName: 'timetables', timestamps: true, underscored: true })
export class Timetable extends Model<
    TimetableAttributes,
    TimetableCreationAttributes
> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id: number

    @Column({ type: DataType.INTEGER, allowNull: false, field: 'class_id' })
    declare classId: number

    @Column({ type: DataType.INTEGER, allowNull: false, field: 'section_id' })
    declare sectionId: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'academic_year_id',
    })
    declare academicYearId: number

    @Column({ type: DataType.STRING, allowNull: false })
    declare name: string

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 8,
        field: 'periods_per_day',
    })
    declare periodsPerDay: number

    @Column({
        type: DataType.JSON,
        allowNull: true,
        field: 'periods_per_day_overrides',
    })
    declare periodsPerDayOverrides: Record<string, number> | null

    @Column({ type: DataType.TIME, allowNull: true, field: 'break_start_time' })
    declare breakStartTime: string | null

    @Column({ type: DataType.TIME, allowNull: true, field: 'break_end_time' })
    declare breakEndTime: string | null

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
    })
    declare isActive: boolean

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
    declare version: number

    @Column({ type: DataType.INTEGER, allowNull: true, field: 'generated_by' })
    declare generatedBy: number | null

    @CreatedAt
    @Column({ field: 'created_at' })
    declare createdAt: Date

    @UpdatedAt
    @Column({ field: 'updated_at' })
    declare updatedAt: Date

    declare class?: Class
    declare section?: Section
    declare academicYear?: AcademicYear
    declare entries?: TimetableEntry[]
}
