'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exam_subjects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'exams',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      subject_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'subjects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      max_marks: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100,
      },
      pass_marks: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 40,
      },
      exam_date: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.addConstraint('exam_subjects', {
      fields: ['exam_id', 'subject_id'],
      type: 'unique',
      name: 'uk_exam_subjects_exam_subject',
    })

    await queryInterface.addIndex('exam_subjects', ['exam_id'], {
      name: 'idx_exam_subjects_exam_id',
    })
    await queryInterface.addIndex('exam_subjects', ['subject_id'], {
      name: 'idx_exam_subjects_subject_id',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('exam_subjects')
  },
}
