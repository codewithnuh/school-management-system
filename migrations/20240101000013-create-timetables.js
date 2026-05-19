import { QueryInterface, DataTypes } from 'sequelize'

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('timetables', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'classes', key: 'id' },
      onDelete: 'CASCADE',
    },
    section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'sections', key: 'id' },
      onDelete: 'CASCADE',
    },
    academic_year_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'academic_years', key: 'id' },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_valid_from: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_valid_to: {
      type: DataTypes.DATE,
      allowNull: false,
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

  await queryInterface.addIndex('timetables', ['class_id'])
  await queryInterface.addIndex('timetables', ['section_id'])
  await queryInterface.addIndex('timetables', ['academic_year_id'])
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('timetables')
}
