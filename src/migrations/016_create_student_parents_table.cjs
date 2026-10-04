'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_parents', {
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
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'parents',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      is_primary: {
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
    await queryInterface.addConstraint('student_parents', {
      fields: ['student_id', 'parent_id'],
      type: 'unique',
      name: 'uk_student_parents_student_parent',
    })

    await queryInterface.addIndex('student_parents', ['student_id'], {
      name: 'idx_student_parents_student_id',
    })
    await queryInterface.addIndex('student_parents', ['parent_id'], {
      name: 'idx_student_parents_parent_id',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('student_parents')
  },
}
