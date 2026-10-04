import { School } from '@/models/School.js'
import { TimeSlot } from '@/models/TimeSlot.js'

const DEFAULT_PERIODS = [
    { periodNumber: 1, startTime: '08:00', endTime: '08:45' },
    { periodNumber: 2, startTime: '08:50', endTime: '09:35' },
    { periodNumber: 3, startTime: '09:40', endTime: '10:25' },
    { periodNumber: 4, startTime: '10:45', endTime: '11:30' },
    { periodNumber: 5, startTime: '11:35', endTime: '12:20' },
    { periodNumber: 6, startTime: '12:25', endTime: '13:10' },
] as const

export async function seedTimeSlots(): Promise<void> {
    const schools = await School.findAll({ attributes: ['id'] })

    for (const school of schools) {
        for (const period of DEFAULT_PERIODS) {
            await TimeSlot.findOrCreate({
                where: { schoolId: school.id, periodNumber: period.periodNumber },
                defaults: {
                    schoolId: school.id,
                    name: `Period ${period.periodNumber}`,
                    ...period,
                    isBreak: false,
                    isActive: true,
                },
            })
        }
    }
}
