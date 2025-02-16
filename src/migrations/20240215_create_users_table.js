'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      middleName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
      },
      placeOfBirth: {
        type: Sequelize.STRING,
      },
      nationality: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      phoneNo: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isNumeric: true,
          len: [10, 15],
        },
      },
      entityType: {
        type: Sequelize.ENUM('STUDENT'),
        defaultValue: 'STUDENT',
      },
      emergencyContactName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      emergencyContactNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isNumeric: true,
          len: [10, 15],
        },
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      currentAddress: {
        type: Sequelize.STRING,
      },
      studentId: {
        type: Sequelize.VIRTUAL,
        allowNull: false,
        unique: true,
      },
      previousSchool: {
        type: Sequelize.STRING,
      },
      previousGrade: {
        type: Sequelize.STRING,
      },
      previousMarks: {
        type: Sequelize.STRING,
      },
      isRegistered: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      guardianName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      guardianCNIC: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isNumeric: true,
          len: [13, 13],
        },
      },
      guardianPhone: {
        type: Sequelize.STRING,
        validate: {
          isNumeric: true,
          len: [10, 15],
        },
      },
      guardianEmail: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true,
        },
      },
      CNIC: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isNumeric: true,
          len: [13, 13],
        },
      },
      classId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sectionId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      enrollmentDate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      photo: {
        type: Sequelize.STRING,
      },
      transportation: {
        type: Sequelize.STRING,
      },
      extracurriculars: {
        type: Sequelize.STRING,
      },
      medicalConditions: {
        type: Sequelize.STRING,
      },
      allergies: {
        type: Sequelize.STRING,
      },
      healthInsuranceInfo: {
        type: Sequelize.STRING,
      },
      doctorContact: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};