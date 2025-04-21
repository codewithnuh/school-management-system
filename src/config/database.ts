import { Sequelize } from 'sequelize-typescript'
import { config } from 'dotenv'
import process from 'process'
import {
    Class,
    Section,
    Subject,
    Teacher,
    Timetable,
    TimetableEntry,
    SectionTeacher,
    OTP,
    PasswordResetToken,
    TimeSlot,
    User,
    Result,
    Grade,
    Exam,
    ClassSubject,
    StudentExam,
    FeePayment,
    AcademicYear,
    FeeCategory,
    FeeStructure,
    StudentFeeAllocation,
    Parent,
    Admin,
    Session,
} from '@/models/index.js'

config()

// Database configuration
const DB_NAME = process.env.DB_NAME || 'school_db'
const DB_USER = process.env.DB_USER || 'root'
const DB_PASSWORD = process.env.DB_PASSWORD || 'yourpassword'
const DB_HOST = process.env.DB_HOST || 'school_db' // Docker service name
const DB_PORT = Number(process.env.DB_PORT || 3306) // internal container port

// Determine if we need SSL based on environment
const isProduction = process.env.NODE_ENV === 'production'

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
    
    dialectOptions: isProduction ? {
        ssl: {
            require: true,
            rejectUnauthorized: false, // You can adjust this based on your SSL requirements
        },
    } : {},
    
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },

    models: [
        Class,
        Section,
        ClassSubject,
        Subject,
        Teacher,
        Timetable,
        TimetableEntry,
        SectionTeacher,
        OTP,
        User,
        PasswordResetToken,
        Session,
        TimeSlot,
        Result,
        Grade,
        Exam,
        StudentExam,
        AcademicYear,
        AcademicYear,
        FeePayment,
        FeeStructure,
        FeeCategory,
        StudentFeeAllocation,
        Parent,
        Admin,
    ],
})
Section.belongsTo(Teacher, { foreignKey: 'classTeacherId' })
Teacher.hasMany(Section, { foreignKey: 'classTeacherId' })
Teacher.belongsTo(Subject, { foreignKey: 'subjectId' })
SectionTeacher.belongsTo(Subject, { foreignKey: 'subjectId' })
SectionTeacher.belongsTo(Teacher, { foreignKey: 'teacherId' })
Subject.hasMany(SectionTeacher, { foreignKey: 'sectionId' })
Class.belongsTo(Exam, { foreignKey: 'examId' })
Exam.hasMany(Class, { foreignKey: 'classId' })
Exam.hasMany(Section, { foreignKey: 'sectionId' })
Section.belongsTo(Exam, { foreignKey: 'examId' })
Class.hasMany(User, { foreignKey: 'studentId' })
FeePayment.belongsTo(StudentFeeAllocation, {
    foreignKey: 'studentFeeAllocationId',
})
FeePayment.belongsTo(FeeStructure, { foreignKey: 'feeStructureId' })
AcademicYear.hasMany(StudentFeeAllocation, {
    foreignKey: 'studentFeeAllocationId',
})
AcademicYear.hasMany(StudentFeeAllocation, {
    foreignKey: 'studentFeeAllocationId',
})
export default sequelize
