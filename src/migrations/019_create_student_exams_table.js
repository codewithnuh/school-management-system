'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_exams', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'students',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      exam_subject_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'exam_subjects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      marks_obtained: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      grade: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_present: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      evaluated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'teachers',
          key: 'id',
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
      },
      evaluated_at: {
        type: Sequelize.DATE,
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

    // Add unique constraint and indexes
    await queryInterface.addConstraint('student_exams', {
      fields: ['student_id', 'exam_subject_id'],
      type: 'unique',
      name: 'uk_student_exams_student_exam_subject',
    })

    await queryInterface.addIndex('student_exams', ['student_id'], {
      name: 'idx_student_exams_student_id',
    })
    await queryInterface.addIndex('student_exams', ['exam_subject_id'], {
      name: 'idx_student_exams_exam_subject_id',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('student_exams')
  },
}
