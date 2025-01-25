import { Sequelize } from 'sequelize-typescript'
import { User } from '@/models/User'
import { config } from 'dotenv'
config()
const sequelize = new Sequelize({
    database: 'mydb',
    username: 'root',
    password: process.env.MYSQL_PASSWORD,
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    models: [User],
})

export default sequelize
