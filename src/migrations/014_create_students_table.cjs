'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('students', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      class_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'classes',
          key: 'id',
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
      },
      section_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'sections',
          key: 'id',
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
      },
      admission_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      roll_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date_of_birth: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM('MALE', 'FEMALE', 'OTHER'),
        allowNull: false,
      },
      blood_group: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      admission_date: {
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
    await queryInterface.addIndex('students', ['user_id'], {
      name: 'idx_students_user_id',
    })
    await queryInterface.addIndex('students', ['school_id'], {
      name: 'idx_students_school_id',
    })
    await queryInterface.addIndex('students', ['class_id'], {
      name: 'idx_students_class_id',
    })
    await queryInterface.addIndex('students', ['section_id'], {
      name: 'idx_students_section_id',
    })
    await queryInterface.addIndex('students', ['admission_number'], {
      name: 'idx_students_admission_number',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('students')
  },
}
