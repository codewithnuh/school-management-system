import { QueryInterface } from 'sequelize'
import { mockStudents } from '@/data/mockData'

export const seeder = {
    async up(queryInterface: QueryInterface) {
        if (!queryInterface) {
            throw new Error('queryInterface is undefined')
        }
        await queryInterface.bulkInsert('users', mockStudents) // Insert into the 'users' table
    },

    async down(queryInterface: QueryInterface, Sequelize: any) {
        if (!queryInterface) {
            throw new Error('queryInterface is undefined')
        }
        await queryInterface.bulkDelete('users', {}, {}) // Delete all users
    },
}
