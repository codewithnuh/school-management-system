'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('timetables', {
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
      section_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sections',
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
      periods_per_day: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 8,
      },
      periods_per_day_overrides: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'JSON object with day names as keys and period counts as values',
      },
      break_start_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      break_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      version: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      generated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'User ID who generated this timetable',
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
    await queryInterface.addIndex('timetables', ['class_id'], {
      name: 'idx_timetables_class_id',
    })
    await queryInterface.addIndex('timetables', ['section_id'], {
      name: 'idx_timetables_section_id',
    })
    await queryInterface.addIndex('timetables', ['academic_year_id'], {
      name: 'idx_timetables_academic_year_id',
    })
    await queryInterface.addIndex('timetables', ['is_active'], {
      name: 'idx_timetables_is_active',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('timetables')
  },
}
