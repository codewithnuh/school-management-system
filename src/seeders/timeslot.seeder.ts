// src/seeders/timeSlot.seeder.ts
import { TimeSlot } from '@/models/TimeSlot.js'

export const seedTimeSlots = async () => {
    try {
        await TimeSlot.bulkCreate(
            [
                {
                    day: 'MON',
                    startTime: '08:00',
                    endTime: '08:45',
                },
                {
                    day: 'MON',
                    startTime: '09:00',
                    endTime: '09:45',
                },
                {
                    day: 'TUE',
                    startTime: '08:00',
                    endTime: '08:45',
                },
                {
                    day: 'TUE',
                    startTime: '09:00',
                    endTime: '09:45',
                },
                {
                    day: 'WED',
                    startTime: '08:00',
                    endTime: '08:45',
                },
                {
                    day: 'WED',
                    startTime: '09:00',
                    endTime: '09:45',
                },
                {
                    day: 'THU',
                    startTime: '08:00',
                    endTime: '08:45',
                },
                {
                    day: 'THU',
                    startTime: '09:00',
                    endTime: '09:45',
                },
                {
                    day: 'FRI',
                    startTime: '08:00',
                    endTime: '08:45',
                },
                {
                    day: 'FRI',
                    startTime: '09:00',
                    endTime: '09:45',
                },
                {
                    day: 'SAT',
                    startTime: '08:00',
                    endTime: '08:45',
                },
                {
                    day: 'SAT',
                    startTime: '09:00',
                    endTime: '09:45',
                },
            ],
            { ignoreDuplicates: true },
        ) // Ignore duplicates on subsequent seeding
        console.log('Time slots seeded successfully')
    } catch (error) {
        console.error('Error seeding time slots:', error)
    }
}
