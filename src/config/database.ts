import { Sequelize } from 'sequelize-typescript'
import { User } from '@/models/User'
import { config } from 'dotenv'
import { Teacher } from '@/models/Teacher'
import { PasswordResetToken } from '@/models/PasswordResetToken'
import { Session } from '@/models/Session'
import { OTP } from '@/models/OTP'
import { Section } from '@/models/Section'
import { Timetable } from '@/models/TimeTable'
import { TimeSlot } from '@/models/TimeSlot'
import { Class } from '@/models/Class'
import { Subject } from '@/models/Subject'
config()
const sequelize = new Sequelize({
    database: 'mydb',
    username: 'root',
    password: process.env.MYSQL_PASSWORD,
    host: 'localhost',
    logging: false,
    port: 3306,
    dialect: 'mysql',
    models: [
        User,
        Teacher,
        PasswordResetToken,
        Session,
        OTP,
        Section,
        Timetable,
        TimeSlot,
        Class,
        Subject,
    ],
})

export default sequelize
