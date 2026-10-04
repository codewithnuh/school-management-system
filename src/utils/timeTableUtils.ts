export interface GenerateTimeSlotsInput {
    startTime: string // "08:00"
    endTime: string // "14:00"
    periodLength: number // 45 (minutes)
    breakLength?: number // 15 (minutes)
}

export interface GeneratedTimeSlot {
    name: string
    startTime: string
    endTime: string
    periodNumber: number
    isBreak: boolean
}

export function generateTimeSlots(
    input: GenerateTimeSlotsInput,
): GeneratedTimeSlot[] {
    const { startTime, endTime, periodLength, breakLength = 0 } = input
    const slots: GeneratedTimeSlot[] = []
    let currentTime = parseTime(startTime)
    let periodNumber = 1

    while (currentTime < parseTime(endTime)) {
        const slotEnd = addMinutes(currentTime, periodLength)
        if (slotEnd > parseTime(endTime)) break

        slots.push({
            name: `Period ${periodNumber}`,
            startTime: formatTime(currentTime),
            endTime: formatTime(slotEnd),
            periodNumber,
            isBreak: false,
        })
        periodNumber += 1

        // Add break
        if (breakLength > 0) {
            const breakEnd = addMinutes(slotEnd, breakLength)
            slots.push({
                name: 'Break',
                startTime: formatTime(slotEnd),
                endTime: formatTime(breakEnd),
                periodNumber,
                isBreak: true,
            })
            periodNumber += 1
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
