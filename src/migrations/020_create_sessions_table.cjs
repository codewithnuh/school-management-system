'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('sessions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            token_hash: {
                allowNull: false,
                unique: true,
                type: Sequelize.STRING(64),
            },
            user_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            entity_type: {
                allowNull: false,
                type: Sequelize.ENUM(
                    'ADMIN',
                    'TEACHER',
                    'USER',
                    'STUDENT',
                    'PARENT',
                    'OWNER',
                ),
            },
            expiry_date: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            user_agent: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            ip_address: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            is_super_admin: {
                allowNull: false,
                defaultValue: false,
                type: Sequelize.BOOLEAN,
            },
            created_at: {
                allowNull: false,
                defaultValue: Sequelize.literal('NOW()'),
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                defaultValue: Sequelize.literal('NOW()'),
                type: Sequelize.DATE,
            },
        })

        await queryInterface.addIndex('sessions', ['user_id', 'entity_type'], {
            name: 'idx_sessions_user_entity',
        })
        await queryInterface.addIndex('sessions', ['expiry_date'], {
            name: 'idx_sessions_expiry_date',
        })
    },

    async down(queryInterface) {
        await queryInterface.dropTable('sessions')
        await queryInterface.dropEnum('enum_sessions_entity_type')
    },
}
