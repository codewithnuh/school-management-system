import { QueryInterface } from 'sequelize'

export const seeder = {
    async up(queryInterface: QueryInterface) {
        if (!queryInterface) {
            throw new Error('queryInterface is undefined')
        }
    },

    async down(queryInterface: QueryInterface, Sequelize: any) {
        if (!queryInterface) {
            throw new Error('queryInterface is undefined')
        }
        await queryInterface.bulkDelete('users', {}, {}) // Delete all users
    },
}
