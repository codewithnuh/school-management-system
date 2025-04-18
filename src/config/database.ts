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

// Determine if we need SSL based on environment
const isProduction = process.env.NODE_ENV === 'production'

const sequelize = new Sequelize(process.env.DATABASE_URI as string, {
    logging: false,

    dialectOptions: isProduction ? {
        ssl: {
            require: true,
            rejectUnauthorized: false, // You can adjust this based on your SSL requirements
        },
    } : {},

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
