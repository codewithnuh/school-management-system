// src/seeders/subject.seeder.ts
import { Subject } from '@/models/Subject.js'

export const seedSubjects = async () => {
    try {
        await Subject.bulkCreate(
            [
                {
                    name: 'Maths',
                    description: 'Mathematics subject',
                    schoolId: 8,
                },
                {
                    name: 'English',
                    description: 'English subject',
                    schoolId: 8,
                },
                {
                    name: 'Computer Science',
                    description: 'Computer Science subject',
                    schoolId: 8,
                },
                {
                    name: 'Physics',
                    description: 'Physics subject',
                    schoolId: 8,
                },
                {
                    name: 'Chemistry',
                    description: 'Chemistry subject',
                    schoolId: 8,
                },
                {
                    name: 'Urdu',
                    description: 'Urdu subject',
                    schoolId: 8,
                },
                {
                    name: 'Pakistan Study',
                    description: 'Pakistan Study subject',
                    schoolId: 8,
                },
            ],
            { ignoreDuplicates: true },
        ) // Ignore duplicates on subsequent seeding
        console.log('Subjects seeded successfully')
    } catch (error) {
        console.error('Error seeding subjects:', error)
    }
}
