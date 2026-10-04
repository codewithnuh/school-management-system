'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exams', {
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
      exam_type: {
        type: Sequelize.ENUM('UNIT_TEST', 'HALF_YEARLY', 'ANNUAL', 'QUARTERLY', 'OTHER'),
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
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
    await queryInterface.addIndex('exams', ['school_id'], {
      name: 'idx_exams_school_id',
    })
    await queryInterface.addIndex('exams', ['academic_year_id'], {
      name: 'idx_exams_academic_year_id',
    })
    await queryInterface.addIndex('exams', ['exam_type'], {
      name: 'idx_exams_exam_type',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('exams')
  },
}
