import { QueryInterface, DataTypes } from 'sequelize'

export async function up(queryInterface: QueryInterface) {
  // Class-Subject junction table
  await queryInterface.createTable('class_subjects', {
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
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'subjects', key: 'id' },
      onDelete: 'CASCADE',
    },
    is_compulsory: {
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

  await queryInterface.addConstraint('class_subjects', {
    fields: ['class_id', 'subject_id'],
    type: 'unique',
    name: 'unique_class_subject',
  })

  // Section-Teacher junction table
  await queryInterface.createTable('section_teachers', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'sections', key: 'id' },
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
    academic_year_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'academic_years', key: 'id' },
      onDelete: 'SET NULL',
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

  await queryInterface.addConstraint('section_teachers', {
    fields: ['section_id', 'teacher_id', 'subject_id'],
    type: 'unique',
    name: 'unique_section_teacher_subject',
  })

  // Student-Parent junction table
  await queryInterface.createTable('student_parents', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'students', key: 'id' },
      onDelete: 'CASCADE',
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'parents', key: 'id' },
      onDelete: 'CASCADE',
    },
    relationship: {
      type: DataTypes.ENUM('FATHER', 'MOTHER', 'GUARDIAN'),
      allowNull: false,
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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

  await queryInterface.addConstraint('student_parents', {
    fields: ['student_id', 'parent_id'],
    type: 'unique',
    name: 'unique_student_parent',
  })
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('student_parents')
  await queryInterface.dropTable('section_teachers')
  await queryInterface.dropTable('class_subjects')
}
