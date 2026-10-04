import type { Optional } from 'sequelize'
import {
    Column,
    CreatedAt,
    DataType,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript'
import { z } from 'zod'
import type { Room } from './Room.js'
import type { Section } from './Section.js'
import type { SectionTeacher } from './SectionTeacher.js'
import type { Subject } from './Subject.js'
import type { TimetableEntry } from './TimetableEntry.js'
import type { User } from './User.js'

export const TEACHER_GENDERS = ['MALE', 'FEMALE', 'OTHER'] as const
export const TEACHER_APPLICATION_STATUSES = [
    'PENDING',
    'INTERVIEW',
    'ACCEPTED',
    'REJECTED',
] as const

export type TeacherGender = (typeof TEACHER_GENDERS)[number]
export type TeacherApplicationStatus = (typeof TEACHER_APPLICATION_STATUSES)[number]

export const ApplicationStatus = {
    Pending: 'PENDING',
    Interview: 'INTERVIEW',
    Accepted: 'ACCEPTED',
    Rejected: 'REJECTED',
} as const satisfies Record<string, TeacherApplicationStatus>

export const TeacherSchema = z.object({
    userId: z.number().int().positive(),
    schoolId: z.number().int().positive(),
    employeeCode: z.string().trim().min(1).max(80),
    qualification: z.string().trim().min(1).max(255),
    specialization: z.string().trim().max(255).nullable().optional(),
    experienceYears: z.number().int().nonnegative().default(0),
    joiningDate: z.date(),
    dateOfBirth: z.date().nullable().optional(),
    gender: z.enum(TEACHER_GENDERS).nullable().optional(),
    address: z.string().max(1000).nullable().optional(),
    emergencyContactName: z.string().max(255).nullable().optional(),
    emergencyContactPhone: z.string().max(40).nullable().optional(),
    isVerified: z.boolean().default(false),
    verificationDocument: z.string().max(500).nullable().optional(),
    cvPath: z.string().max(500).nullable().optional(),
    applicationStatus: z.enum(TEACHER_APPLICATION_STATUSES).default('PENDING'),
    isActive: z.boolean().default(true),
})

export interface TeacherAttributes {
    id: number
    userId: number
    schoolId: number
    employeeCode: string
    qualification: string
    specialization: string | null
    experienceYears: number
    joiningDate: Date
    dateOfBirth: Date | null
    gender: TeacherGender | null
    address: string | null
    emergencyContactName: string | null
    emergencyContactPhone: string | null
    isVerified: boolean
    verificationDocument: string | null
    cvPath: string | null
    applicationStatus: TeacherApplicationStatus
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export type TeacherCreationAttributes = Optional<
    TeacherAttributes,
    | 'id'
    | 'specialization'
    | 'experienceYears'
    | 'dateOfBirth'
    | 'gender'
    | 'address'
    | 'emergencyContactName'
    | 'emergencyContactPhone'
    | 'isVerified'
    | 'verificationDocument'
    | 'cvPath'
    | 'applicationStatus'
    | 'isActive'
    | 'address'
    | 'emergencyContactName'
    | 'emergencyContactPhone'
    | 'createdAt'
    | 'updatedAt'
>

@Table({ tableName: 'teachers', timestamps: true, underscored: true })
export class Teacher extends Model<TeacherAttributes, TeacherCreationAttributes> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id: number

    @Column({ type: DataType.INTEGER, allowNull: false, field: 'user_id', unique: true })
    declare userId: number

    @Column({ type: DataType.INTEGER, allowNull: false, field: 'school_id' })
    declare schoolId: number

    @Column({ type: DataType.STRING, allowNull: false, field: 'employee_code', unique: true })
    declare employeeCode: string

    @Column({ type: DataType.STRING, allowNull: false })
    declare qualification: string

    @Column({ type: DataType.STRING, allowNull: true })
    declare specialization: string | null

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'experience_years' })
    declare experienceYears: number

    @Column({ type: DataType.DATE, allowNull: false, field: 'joining_date' })
    declare joiningDate: Date

    @Column({ type: DataType.DATE, allowNull: true, field: 'date_of_birth' })
    declare dateOfBirth: Date | null

    @Column({ type: DataType.ENUM(...TEACHER_GENDERS), allowNull: true })
    declare gender: TeacherGender | null

    @Column({ type: DataType.TEXT, allowNull: true })
    declare address: string | null

    @Column({ type: DataType.STRING, allowNull: true, field: 'emergency_contact_name' })
    declare emergencyContactName: string | null

    @Column({ type: DataType.STRING, allowNull: true, field: 'emergency_contact_phone' })
    declare emergencyContactPhone: string | null

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_verified' })
    declare isVerified: boolean

    @Column({ type: DataType.STRING, allowNull: true, field: 'verification_document' })
    declare verificationDocument: string | null

    @Column({ type: DataType.STRING, allowNull: true, field: 'cv_path' })
    declare cvPath: string | null

    @Column({ type: DataType.ENUM(...TEACHER_APPLICATION_STATUSES), allowNull: false, defaultValue: 'PENDING', field: 'application_status' })
    declare applicationStatus: TeacherApplicationStatus

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' })
    declare isActive: boolean

    @CreatedAt
    @Column({ type: DataType.DATE, field: 'created_at' })
    declare createdAt: Date

    @UpdatedAt
    @Column({ type: DataType.DATE, field: 'updated_at' })
    declare updatedAt: Date

    declare user?: User

    declare sectionTeachers?: SectionTeacher[]

    declare timetableEntries?: TimetableEntry[]

    declare sections?: Section[]
    declare subjects?: Subject[]
    declare room?: Room
}
