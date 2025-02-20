'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('OTPs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            otp: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            entityId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            entityType: {
                type: Sequelize.ENUM('STUDENT', 'ADMIN', 'TEACHER', 'PARENT'),
                allowNull: false,
            },
            isUsed: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            expiresAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('NOW()'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('NOW()'),
            },
        })
    },

    async down(queryInterface, Sequelize) {
        // Remove the ENUM type explicitly if necessary depending on the version of Sequelize/DBMS
        await queryInterface.dropTable('OTPs')
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_OTPs_entityType";',
        )
    },
}
