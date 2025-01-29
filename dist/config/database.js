import { Sequelize } from 'sequelize-typescript';
import { User } from '@/models/User';
import { config } from 'dotenv';
import { Teacher } from '@/models/Teacher';
import { PasswordResetToken } from '@/models/PasswordResetToken';
import { Session } from '@/models/Session';
config();
const sequelize = new Sequelize({
    database: 'mydb',
    username: 'root',
    password: process.env.MYSQL_PASSWORD,
    host: 'localhost',
    logging: false,
    port: 3306,
    dialect: 'mysql',
    models: [User, Teacher, PasswordResetToken, Session],
});
export default sequelize;
