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
    ExamSubject,
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
        Grade,
        Exam,
        ExamSubject,
    ],
})
Section.belongsTo(Teacher, { foreignKey: 'classTeacherId' })
Teacher.hasMany(Section, { foreignKey: 'classTeacherId' })
SectionTeacher.belongsTo(Subject, { foreignKey: 'subjectId' })
SectionTeacher.belongsTo(Teacher, { foreignKey: 'teacherId' })
Subject.hasMany(SectionTeacher, { foreignKey: 'sectionId' })
export default sequelize
