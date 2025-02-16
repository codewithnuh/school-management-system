'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('parents', {
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
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      phoneNo: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { isNumeric: true, len: [10, 15] },
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      guardianCNIC: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { isNumeric: true, len: [13, 13] },
      },
      guardianPhone: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: { isNumeric: true, len: [10, 15] },
      },
      guardianEmail: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: { isEmail: true },
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
    await queryInterface.dropTable('parents');
  },
};