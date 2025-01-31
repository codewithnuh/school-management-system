// src/seeders/class.seeder.ts
import { Class } from '@/models/Class'

export const seedClasses = async () => {
    try {
        await Class.bulkCreate(
            [
                {
                    name: 'Grade 1',
                    description: 'First grade class',
                    maxStudents: 30,
                    periodsPerDay: 7,
                },
                {
                    name: 'Grade 2',
                    description: 'Second grade class',
                    maxStudents: 35,
                    periodsPerDay: 7,
                },
            ],
            { ignoreDuplicates: true },
        ) // Ignore duplicates on subsequent seeding
        console.log('Classes seeded successfully')
    } catch (error) {
        console.error('Error seeding classes:', error)
    }
}
