'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Results', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            studentId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            examId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Exams',
                    key: 'id',
                },
            },
            subjectId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Subjects',
                    key: 'id',
                },
            },
            marks: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            gradeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Grades',
                    key: 'id',
                },
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
        await queryInterface.dropTable('Results')
    },
}
