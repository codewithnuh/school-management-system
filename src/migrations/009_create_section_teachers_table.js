'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('section_teachers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'teachers',
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
      is_class_teacher: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.addConstraint('section_teachers', {
      fields: ['section_id', 'subject_id'],
      type: 'unique',
      name: 'uk_section_teachers_section_subject',
    })

    await queryInterface.addIndex('section_teachers', ['section_id'], {
      name: 'idx_section_teachers_section_id',
    })
    await queryInterface.addIndex('section_teachers', ['teacher_id'], {
      name: 'idx_section_teachers_teacher_id',
    })
    await queryInterface.addIndex('section_teachers', ['subject_id'], {
      name: 'idx_section_teachers_subject_id',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('section_teachers')
  },
}
