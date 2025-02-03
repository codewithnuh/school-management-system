import { Sequelize } from 'sequelize-typescript'
import { User } from '@/models/User.js'
import { config } from 'dotenv'
import process from 'process'
import { Teacher } from '@/models/Teacher.js'
import { PasswordResetToken } from '@/models/PasswordResetToken.js'
import { Session } from '@/models/Session.js'
import { OTP } from '@/models/OTP.js'
import { Section } from '@/models/section.js'
import { Timetable } from '@/models/TimeTable.js'
import { TimetableEntry } from '@/models/TimeTableEntry.js'
import { Class } from '@/models/Class.js'
import { Subject } from '@/models/Subject.js'
import { Room } from '@/models/Room.js'
import { ClassSubject } from '@/models/ClassSubject.js'
import { SectionTeacher } from '@/models/SectionTeacher.js'
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
        User,
        Teacher,
        PasswordResetToken,
        Session,
        OTP,
        Section,
        Timetable,
        TimetableEntry,
        Class,
        Room,
        ClassSubject,
        SectionTeacher,
        Subject,
    ],
})

export default sequelize
