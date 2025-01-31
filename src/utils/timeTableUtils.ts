import { TimeSlotAttributes } from '@/models/TimeSlot'

// utils/timetableUtils.ts
interface GenerateTimeSlotsInput {
    startTime: string // "08:00"
    endTime: string // "14:00"
    periodLength: number // 45 (minutes)
    breakLength?: number // 15 (minutes)
}

export function generateTimeSlots(
    input: GenerateTimeSlotsInput,
): TimeSlotAttributes[] {
    const { startTime, endTime, periodLength, breakLength = 0 } = input
    const slots: TimeSlotAttributes[] = []
    let currentTime = parseTime(startTime)

    while (currentTime < parseTime(endTime)) {
        const slotEnd = addMinutes(currentTime, periodLength)
        if (slotEnd > parseTime(endTime)) break

        slots.push({
            startTime: formatTime(currentTime),
            endTime: formatTime(slotEnd),
            day: 'MON', // Repeat for other days
        })

        // Add break
        if (breakLength > 0) {
            const breakEnd = addMinutes(slotEnd, breakLength)
            slots.push({
                startTime: formatTime(slotEnd),
                endTime: formatTime(breakEnd),
                day: 'MON',
                type: 'BREAK', // Add this field to TimeSlot model
            })
            currentTime = breakEnd
        } else {
            currentTime = slotEnd
        }
    }

    return slots
}

// Helper functions
function parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
}

function addMinutes(time: number, minutes: number): number {
    return time + minutes
}

function formatTime(time: number): string {
    const hours = Math.floor(time / 60)
    const minutes = time % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
