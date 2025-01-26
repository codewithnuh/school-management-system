import {
    Table,
    Column,
    Model,
    DataType,
    Default,
    IsUUID,
} from 'sequelize-typescript'
import { z } from 'zod'
import UUIDV4 from 'sequelize'
import { Subject, teacherSchema } from '@/schema/teacher.schema'

// Interface for Teacher Attributes (derived from Zod schema)
export type TeacherAttributes = z.infer<typeof teacherSchema> & {
    id?: number
    uuid?: string
    isVerified?: boolean
    role: 'TEACHER' | 'ADMIN'
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

    @Default(UUIDV4)
    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        allowNull: true,
        unique: true,
    })
    uuid?: string

    @Column({ type: DataType.STRING, allowNull: false })
    firstName!: string

    @Column({ type: DataType.STRING })
    middleName?: string

    @Column({ type: DataType.STRING, allowNull: false })
    lastName!: string

    @Column({ type: DataType.DATE, allowNull: false })
    dateOfBirth!: Date

    @Column({
        type: DataType.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
    })
    gender!: 'Male' | 'Female' | 'Other'

    @Column({ type: DataType.STRING })
    nationality?: string

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
        validate: { isNumeric: true },
    })
    phoneNo!: string
    @Column({ type: DataType.STRING, allowNull: true })
    password!: string
    @Column({ type: DataType.STRING, allowNull: false })
    address!: string

    @Column({ type: DataType.STRING })
    currentAddress?: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: { isNumeric: true },
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
        validate: { isNumeric: true },
    })
    emergencyContactNumber!: string

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isVerified?: boolean

    @Column({ type: DataType.STRING })
    verificationDocument?: string

    @Column({ type: DataType.STRING })
    cvPath?: string

    @Default('TEACHER')
    @Column({
        type: DataType.STRING,
        defaultValue: 'TEACHER',
        allowNull: false,
    })
    role!: 'TEACHER'

    @Column({
        type: DataType.JSON, // Store subjects as JSON array
    })
    subjects?: Subject[]
}
