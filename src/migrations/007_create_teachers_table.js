'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('teachers', {
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
      employee_code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      qualification: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      specialization: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      experience_years: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      joining_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      date_of_birth: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM('MALE', 'FEMALE', 'OTHER'),
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      emergency_contact_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      emergency_contact_phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      verification_document: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cv_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      application_status: {
        type: Sequelize.ENUM('PENDING', 'INTERVIEW', 'ACCEPTED', 'REJECTED'),
        defaultValue: 'PENDING',
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
    await queryInterface.addIndex('teachers', ['user_id'], {
      name: 'idx_teachers_user_id',
    })
    await queryInterface.addIndex('teachers', ['school_id'], {
      name: 'idx_teachers_school_id',
    })
    await queryInterface.addIndex('teachers', ['employee_code'], {
      name: 'idx_teachers_employee_code',
    })
    await queryInterface.addIndex('teachers', ['is_active'], {
      name: 'idx_teachers_is_active',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('teachers')
  },
}
