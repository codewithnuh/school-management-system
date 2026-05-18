'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('timetable_entries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      timetable_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'timetables',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'teachers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      subject_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'subjects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      day_of_week: {
        type: Sequelize.ENUM(
          'MONDAY',
          'TUESDAY',
          'WEDNESDAY',
          'THURSDAY',
          'FRIDAY',
          'SATURDAY',
          'SUNDAY'
        ),
        allowNull: false,
      },
      period_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'rooms',
          key: 'id',
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
      },
      is_substitute: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    // Add indexes for efficient querying
    await queryInterface.addIndex('timetable_entries', ['timetable_id'], {
      name: 'idx_timetable_entries_timetable_id',
    })
    await queryInterface.addIndex('timetable_entries', ['teacher_id'], {
      name: 'idx_timetable_entries_teacher_id',
    })
    await queryInterface.addIndex('timetable_entries', ['subject_id'], {
      name: 'idx_timetable_entries_subject_id',
    })
    await queryInterface.addIndex('timetable_entries', ['day_of_week', 'period_number'], {
      name: 'idx_timetable_entries_day_period',
    })
    
    // Add unique constraint to prevent duplicate entries for same timetable, day, and period
    await queryInterface.addConstraint('timetable_entries', {
      fields: ['timetable_id', 'day_of_week', 'period_number'],
      type: 'unique',
      name: 'uk_timetable_entries_timetable_day_period',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('timetable_entries')
  },
}
