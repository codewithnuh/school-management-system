'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('class_subjects', {
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
      periods_per_week: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 4,
      },
      is_compulsory: {
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

    // Add unique constraint and indexes
    await queryInterface.addConstraint('class_subjects', {
      fields: ['class_id', 'subject_id'],
      type: 'unique',
      name: 'uk_class_subjects_class_subject',
    })

    await queryInterface.addIndex('class_subjects', ['class_id'], {
      name: 'idx_class_subjects_class_id',
    })
    await queryInterface.addIndex('class_subjects', ['subject_id'], {
      name: 'idx_class_subjects_subject_id',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('class_subjects')
  },
}
