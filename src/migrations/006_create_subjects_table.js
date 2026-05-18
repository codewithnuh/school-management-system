'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subjects', {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      category: {
        type: Sequelize.ENUM('CORE', 'ELECTIVE', 'EXTRA_CURRICULAR'),
        allowNull: false,
        defaultValue: 'CORE',
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
    await queryInterface.addIndex('subjects', ['school_id'], {
      name: 'idx_subjects_school_id',
    })
    await queryInterface.addIndex('subjects', ['code'], {
      name: 'idx_subjects_code',
    })
    await queryInterface.addIndex('subjects', ['is_active'], {
      name: 'idx_subjects_is_active',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subjects')
  },
}
