import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    HasMany,
    Index,
} from 'sequelize-typescript'
import { z } from 'zod'

import { teacherSchema } from '@/schema/teacher.schema'
import { Timetable } from './TimeTable'

// Define enums for better type safety
export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other',
}

export enum Subject {
    English = 'English',
    Urdu = 'Urdu',
    ComputerScience = 'Computer Science',
    Physics = 'Physics',
    Maths = 'Maths',
    PakistanStudy = 'Pakistan Study',
    Chemistry = 'Chemistry',
}

export enum ApplicationStatus {
    Pending = 'Pending',
    Interview = 'Interview',
    Accepted = 'Accepted',
    Rejected = 'Rejected',
}

export type TeacherAttributes = z.infer<typeof teacherSchema> & {
    id?: number
    isVerified?: boolean
    role: 'TEACHER'
    subject: Subject
}

@Table({
    tableName: 'teachers',
    timestamps: true,
})
export class Teacher
    extends Model<TeacherAttributes>
    implements TeacherAttributes
{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number

    @Column({ type: DataType.STRING, allowNull: false })
    firstName!: string

    @Column({ type: DataType.STRING })
    middleName?: string

    @Column({ type: DataType.STRING, allowNull: false })
    lastName!: string

    @Column({ type: DataType.DATE, allowNull: false })
    dateOfBirth!: Date

    @Column({
        type: DataType.ENUM(...Object.values(Gender)),
        allowNull: false,
    })
    gender!: Gender

    @Column({ type: DataType.STRING })
    nationality?: string

    @Index({ name: 'email', unique: true })
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    })
    email!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 15],
        },
    })
    phoneNo!: string

    @Column({
        type: DataType.ENUM('TEACHER'),
        defaultValue: 'TEACHER',
        allowNull: false,
    })
    entityType!: 'TEACHER'

    @Column({
        type: DataType.STRING,
        allowNull: true, // Allow null for password initially
    })
    password?: string

    @Column({ type: DataType.STRING, allowNull: false })
    address!: string

    @Column({ type: DataType.STRING })
    currentAddress?: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [13, 13],
        },
    })
    cnic!: string

    @Column({ type: DataType.STRING, allowNull: false })
    highestQualification!: string

    @Column({ type: DataType.STRING })
    specialization?: string

    @Column({ type: DataType.INTEGER })
    experienceYears?: number

    @Column({ type: DataType.DATE, allowNull: false })
    joiningDate!: Date

    @Column({ type: DataType.STRING })
    photo?: string

    @Column({ type: DataType.STRING, allowNull: false })
    emergencyContactName!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 15],
        },
    })
    emergencyContactNumber!: string

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isVerified?: boolean

    @Column({
        type: DataType.ENUM(...Object.values(ApplicationStatus)),
        defaultValue: ApplicationStatus.Pending,
    })
    applicationStatus!: ApplicationStatus

    @Column({ type: DataType.STRING })
    verificationDocument?: string

    @Column({ type: DataType.STRING })
    cvPath?: string

    @Column({
        type: DataType.ENUM('TEACHER'),
        defaultValue: 'TEACHER',
        allowNull: false,
    })
    role!: 'TEACHER'

    @Column({
        type: DataType.ENUM(...Object.values(Subject)),
        allowNull: false,
    })
    subject!: Subject

    @HasMany(() => Timetable)
    assignedPeriods!: Timetable[]

    @CreatedAt
    createdAt!: Date

    @UpdatedAt
    updatedAt!: Date
}
