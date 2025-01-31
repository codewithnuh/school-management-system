import { QueryInterface, DataTypes } from 'sequelize'
export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable('section_teachers', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            sectionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'sections', key: 'id' },
                onDelete: 'CASCADE',
            },
            subjectId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'subjects', key: 'id' },
                onDelete: 'CASCADE',
            },
            teacherId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'teachers', key: 'id' },
                onDelete: 'CASCADE',
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        })

        // Unique constraint to prevent duplicate assignments
        await queryInterface.addConstraint('section_teachers', {
            fields: ['sectionId', 'subjectId', 'teacherId'],
            type: 'unique',
            name: 'unique_section_subject_teacher',
        })
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable('section_teachers')
    },
}
