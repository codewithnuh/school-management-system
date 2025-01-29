export const seeder = {
    async up(queryInterface) {
        if (!queryInterface) {
            throw new Error('queryInterface is undefined');
        }
    },
    async down(queryInterface, Sequelize) {
        if (!queryInterface) {
            throw new Error('queryInterface is undefined');
        }
        await queryInterface.bulkDelete('users', {}, {}); // Delete all users
    },
};
