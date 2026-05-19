import { QueryInterface, DataTypes } from 'sequelize'

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('parents', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    father_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mother_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    guardian_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    father_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mother_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    guardian_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    father_occupation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mother_occupation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    guardian_occupation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    annual_income: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  })

  await queryInterface.addIndex('parents', ['user_id'])
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('parents')
}
