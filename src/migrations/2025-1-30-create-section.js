// Example migration file (e.g., 20240726120000-add-cascade-to-sections.js)

'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addConstraint('sections', {
            // Table with the FK
            type: 'foreign key',
            fields: ['classId'], // Foreign key column(s)
            references: {
                table: 'classes', // Referenced table
                field: 'id', // Referenced column(s)
            },
            onDelete: 'CASCADE', // Cascade on delete
            onUpdate: 'CASCADE', // Cascade on update (optional)
        })

        await queryInterface.addConstraint('timetables', {
            // Table with the FK
            type: 'foreign key',
            fields: ['classId'], // Foreign key column(s)
            references: {
                table: 'classes', // Referenced table
                field: 'id', // Referenced column(s)
            },
            onDelete: 'CASCADE', // Cascade on delete
            onUpdate: 'CASCADE', // Cascade on update (optional)
        })
        await queryInterface.addConstraint('timetables', {
            // Table with the FK
            type: 'foreign key',
            fields: ['sectionId'], // Foreign key column(s)
            references: {
                table: 'sections', // Referenced table
                field: 'id', // Referenced column(s)
            },
            onDelete: 'CASCADE', // Cascade on delete
            onUpdate: 'CASCADE', // Cascade on update (optional)
        })
        await queryInterface.addConstraint('timetable_entries', {
            // Table with the FK
            type: 'foreign key',
            fields: ['timetableId'], // Foreign key column(s)
            references: {
                table: 'timetables', // Referenced table
                field: 'id', // Referenced column(s)
            },
            onDelete: 'CASCADE', // Cascade on delete
            onUpdate: 'CASCADE', // Cascade on update (optional)
        })
        await queryInterface.addConstraint('timetable_entries', {
            // Table with the FK
            type: 'foreign key',
            fields: ['subjectId'], // Foreign key column(s)
            references: {
                table: 'subjects', // Referenced table
                field: 'id', // Referenced column(s)
            },
            onDelete: 'CASCADE', // Cascade on delete
            onUpdate: 'CASCADE', // Cascade on update (optional)
        })
        await queryInterface.addConstraint('timetable_entries', {
            // Table with the FK
            type: 'foreign key',
            fields: ['teacherId'], // Foreign key column(s)
            references: {
                table: 'teachers', // Referenced table
                field: 'id', // Referenced column(s)
            },
            onDelete: 'CASCADE', // Cascade on delete
            onUpdate: 'CASCADE', // Cascade on update (optional)
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint(
            'sections',
            'sections_classId_foreign_idx',
        ) // Replace with the actual constraint name if different
        await queryInterface.removeConstraint(
            'timetables',
            'timetables_classId_foreign_idx',
        ) // Replace with the actual constraint name if different
        await queryInterface.removeConstraint(
            'timetables',
            'timetables_sectionId_foreign_idx',
        ) // Replace with the actual constraint name if different
        await queryInterface.removeConstraint(
            'timetable_entries',
            'timetable_entries_timetableId_foreign_idx',
        ) // Replace with the actual constraint name if different
        await queryInterface.removeConstraint(
            'timetable_entries',
            'timetable_entries_subjectId_foreign_idx',
        ) // Replace with the actual constraint name if different
        await queryInterface.removeConstraint(
            'timetable_entries',
            'timetable_entries_teacherId_foreign_idx',
        ) // Replace with the actual constraint name if different
    },
}
