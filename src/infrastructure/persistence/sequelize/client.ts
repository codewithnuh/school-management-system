import { Sequelize } from 'sequelize-typescript'
import { env } from '@/config/env.js'

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30_000,
        idle: 10_000,
    },
    ...(env.DB_SSL
        ? {
              dialectOptions: {
                  ssl: { require: true, rejectUnauthorized: true },
              },
          }
        : {}),
})

export default sequelize
