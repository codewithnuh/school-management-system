'use strict'

/** @type {import("sequelize-cli").Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('sessions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            entityType: {
                allowNull: false,
                type: Sequelize.ENUM('ADMIN', 'TEACHER', 'USER', 'PARENT'),
            },
            token: {
                allowNull: false,
                type: Sequelize.UUID,
                unique: true,
            },
            expiryDate: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            userAgent: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            ipAddress: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('sessions')
        // Remove the ENUM type if necessary
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_sessions_entityType";',
        )
    },
}
