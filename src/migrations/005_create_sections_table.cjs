'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sections', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'classes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      max_students: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 50,
      },
      class_teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'teachers',
          key: 'id',
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
      },
      room_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    })

    // Add indexes
    await queryInterface.addIndex('sections', ['class_id'], {
      name: 'idx_sections_class_id',
    })
    await queryInterface.addIndex('sections', ['is_active'], {
      name: 'idx_sections_is_active',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sections')
  },
}
