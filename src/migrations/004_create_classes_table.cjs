'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('classes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      school_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'schools',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      academic_year_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'academic_years',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      max_students: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 50,
      },
      periods_per_day: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 8,
      },
      period_length: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 40,
      },
      working_days: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: '08:00:00',
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
    await queryInterface.addIndex('classes', ['school_id'], {
      name: 'idx_classes_school_id',
    })
    await queryInterface.addIndex('classes', ['academic_year_id'], {
      name: 'idx_classes_academic_year_id',
    })
    await queryInterface.addIndex('classes', ['is_active'], {
      name: 'idx_classes_is_active',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('classes')
  },
}
