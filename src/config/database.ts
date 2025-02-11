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
    Session,
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
} from '@/models/index.js'

config()
const sequelize = new Sequelize(process.env.DATABASE_URI as string, {
    logging: false,

    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // You can adjust this based on your SSL requirements
        },
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
export default sequelize
