import { Sequelize } from 'sequelize-typescript'
import { User } from '@/models/User'
import { config } from 'dotenv'
import { Teacher } from '@/models/Teacher'
import { PasswordResetToken } from '@/models/PasswordResetToken'
import { Session } from '@/models/Session'
import { OTP } from '@/models/OTP'
import { Section } from '@/models/section'
import { Timetable } from '@/models/TimeTable'
import { TimetableEntry } from '@/models/TimeTableEntry'
import { Class } from '@/models/Class'
import { Subject } from '@/models/Subject'
import { Room } from '@/models/Room'
import { ClassSubject } from '@/models/ClassSubject'
import { SectionTeacher } from '@/models/SectionTeacher'
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
