// src/seeders/subject.seeder.ts
import { Subject } from '@/models/Subject.js'

export const seedSubjects = async () => {
    try {
        await Subject.bulkCreate(
            [
                {
                    name: 'Maths',
                    description: 'Mathematics subject',
                },
                {
                    name: 'English',
                    description: 'English subject',
                },
                {
                    name: 'Computer Science',
                    description: 'Computer Science subject',
                },
                {
                    name: 'Physics',
                    description: 'Physics subject',
                },
                {
                    name: 'Chemistry',
                    description: 'Chemistry subject',
                },
                {
                    name: 'Urdu',
                    description: 'Urdu subject',
                },
                {
                    name: 'Pakistan Study',
                    description: 'Pakistan Study subject',
                },
            ],
            { ignoreDuplicates: true },
        ) // Ignore duplicates on subsequent seeding
        console.log('Subjects seeded successfully')
    } catch (error) {
        console.error('Error seeding subjects:', error)
    }
}
