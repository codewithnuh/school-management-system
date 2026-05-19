import { QueryInterface, DataTypes } from 'sequelize'

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('timetable_entries', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    timetable_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'timetables', key: 'id' },
      onDelete: 'CASCADE',
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'teachers', key: 'id' },
      onDelete: 'CASCADE',
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'subjects', key: 'id' },
      onDelete: 'CASCADE',
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'rooms', key: 'id' },
      onDelete: 'SET NULL',
    },
    day_of_week: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday',
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    period_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

  await queryInterface.addIndex('timetable_entries', ['timetable_id'])
  await queryInterface.addIndex('timetable_entries', ['teacher_id'])
  await queryInterface.addIndex('timetable_entries', ['day_of_week'])
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('timetable_entries')
}
