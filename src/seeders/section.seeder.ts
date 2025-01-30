// src/seeders/section.seeder.ts
import { Section } from '@/models/Section'
import { Class } from '@/models/Class'
import { Teacher } from '@/models/Teacher'

export const seedSections = async () => {
    try {
        const classes = await Class.findAll()
        const teachers = await Teacher.findAll()
        if (classes.length < 1 || teachers.length < 1) {
            throw new Error(
                'There are no classes or teachers to create a section',
            )
        }
        await Section.bulkCreate(
            [
                {
                    name: 'A',
                    classId: classes[0].id,
                    classTeacherId: teachers[0].id,
                },
                {
                    name: 'B',
                    classId: classes[0].id,
                    classTeacherId: teachers[1].id,
                },
                {
                    name: 'A',
                    classId: classes[1].id,
                    classTeacherId: teachers[0].id,
                },
            ],
            { ignoreDuplicates: true },
        ) // Ignore duplicates on subsequent seeding
        console.log('Sections seeded successfully')
    } catch (error) {
        console.error('Error seeding sections:', error)
    }
}
