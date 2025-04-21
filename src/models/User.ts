import { userSchema } from '@/schema/user.schema.js'
import { DataTypes, UUIDV4 } from 'sequelize'
import {
    Table,
    Column,
    Model,
    DataType,
    Default,
    ForeignKey,
    HasMany,
    BelongsTo,
} from 'sequelize-typescript'
import { z } from 'zod'
import { Class, Parent, Section, StudentExam } from '@/models/index.js'

type UserAttributes = z.infer<typeof userSchema>

@Table({
    tableName: 'users',
    timestamps: true,
})
export class User extends Model<UserAttributes> implements UserAttributes {
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

    @Column({ type: DataType.STRING, allowNull: false })
    dateOfBirth!: string

    @Column({
        type: DataType.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
    })
    gender!: 'Male' | 'Female' | 'Other'

    @Column({ type: DataType.STRING })
    placeOfBirth?: string

    @Column({ type: DataType.STRING })
    nationality?: string

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
    })
    email!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: { isNumeric: true, len: [10, 15] },
    })
    phoneNo!: string
    @Column({ type: DataType.ENUM('STUDENT'), defaultValue: 'STUDENT' })
    entityType!: 'STUDENT'
    @Column({ type: DataType.STRING, allowNull: false })
    emergencyContactName!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: { isNumeric: true, len: [10, 15] },
    })
    emergencyContactNumber!: string

    @Column({ type: DataType.STRING, allowNull: false })
    address!: string

    @Column({ type: DataType.STRING })
    currentAddress?: string

    @Column({ type: DataType.VIRTUAL, allowNull: true, unique: true })
    studentId!: string

    @Column({ type: DataType.STRING })
    previousSchool?: string

    @Column({ type: DataType.STRING })
    previousGrade?: string

    @Column({ type: DataType.STRING })
    previousMarks?: string

    @Column({ type: DataType.BOOLEAN, defaultValue: false, allowNull: true })
    isRegistered!: boolean
    @Column({
        type: DataTypes.STRING,
        allowNull: true,
    })
    password!: string
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    guardianName!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: { isNumeric: true, len: [13, 13] },
    })
    guardianCNIC!: string

    @Column({
        type: DataType.STRING,
        validate: { isNumeric: true, len: [10, 15] },
    })
    guardianPhone?: string

    @Column({ type: DataType.STRING, validate: { isEmail: true } })
    guardianEmail?: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: { isNumeric: true, len: [13, 13] },
    })
    CNIC!: string
    @ForeignKey(() => Class)
    @Column({ type: DataType.STRING, allowNull: false })
    classId!: number
    @ForeignKey(() => Section)
    @Column({ type: DataType.INTEGER, allowNull: true })
    sectionId!: number

    @Default(UUIDV4)
    @Column({ type: DataType.UUID, allowNull: true })
    uuid?: string

    @Column({ type: DataType.STRING, allowNull: false })
    enrollmentDate!: string

    @Column({ type: DataType.STRING })
    photo?: string

    @Column({ type: DataType.STRING })
    transportation?: string

    @Column({ type: DataType.STRING })
    extracurriculars?: string

    @Column({ type: DataType.STRING })
    medicalConditions?: string

    @Column({ type: DataType.STRING })
    allergies?: string

    @Column({ type: DataType.STRING })
    healthInsuranceInfo?: string

    @Column({ type: DataType.STRING })
    doctorContact?: string
    @Column({ type: DataType.DATE, defaultValue: DataTypes.NOW() })
    createdAt?: Date
    @Column({ type: DataType.DATE, defaultValue: DataTypes.NOW() })
    updatedAt?: Date
    @HasMany(() => StudentExam)
    studentExams!: StudentExam[]
    @ForeignKey(() => Parent)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    parentId?: number
    @BelongsTo(() => Parent)
    parent?: Parent
}
