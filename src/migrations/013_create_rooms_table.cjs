'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rooms', {
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
      building: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      floor: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      room_type: {
        type: Sequelize.ENUM('CLASSROOM', 'LAB', 'COMPUTER_LAB', 'LIBRARY', 'AUDITORIUM', 'GYM', 'OTHER'),
        defaultValue: 'CLASSROOM',
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
    await queryInterface.addIndex('rooms', ['school_id'], {
      name: 'idx_rooms_school_id',
    })
    await queryInterface.addIndex('rooms', ['is_active'], {
      name: 'idx_rooms_is_active',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rooms')
  },
}
