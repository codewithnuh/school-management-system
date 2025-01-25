import { Table, Column, Model, DataType } from 'sequelize-typescript'
type Subject =
    | 'English'
    | 'Urdu'
    | 'Computer Science'
    | 'Physics'
    | 'Maths'
    | 'Pakistan Study'
    | 'Chemistry'
interface TeacherAttributes {
    id: number
    firstName: string
    middleName?: string
    lastName: string
    dateOfBirth: Date
    gender: 'Male' | 'Female' | 'Other'
    nationality?: string
    email: string
    phoneNo: string
    address: string
    isClassTeacher: boolean
    currentAddress?: string
    cnic: string
    highestQualification: string
    specialization?: string
    experienceYears?: number
    joiningDate: Date
    photo?: string
    emergencyContactName: string
    emergencyContactNumber: string
    isVerified?: boolean
    verificationDocument?: string
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
        validate: { isNumeric: true, len: [10, 15] },
    })
    phoneNo!: string

    @Column({ type: DataType.STRING, allowNull: false })
    address!: string
    @Column({ type: DataType.BOOLEAN, allowNull: false })
    isClassTeacher!: boolean
    @Column({ type: DataType.STRING })
    currentAddress?: string

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
        validate: { isNumeric: true, len: [13, 13] },
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
        validate: { isNumeric: true, len: [10, 15] },
    })
    emergencyContactNumber!: string

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isVerified?: boolean

    @Column({ type: DataType.STRING })
    verificationDocument?: string

    @Column({ type: DataType.STRING })
    cvUrl?: string // Path or URL to CV
    @Column({ type: DataType.STRING })
    subject!: Subject
}
