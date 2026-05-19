/**
 * Time utility functions for timetable management
 */

/**
 * Generate a human-readable label for a time slot
 */
export function generateTimeSlotLabel(startTime: string, endTime: string): string {
  return `${startTime} - ${endTime}`;
}

/**
 * Check if a given day (0-6, where 0 is Sunday) is a weekend
 */
export function isWeekend(day: number): boolean {
  return day === 0 || day === 6; // Sunday or Saturday
}

/**
 * Get array of working days (Monday=1 to Friday=5 by default)
 */
export function getWorkingDays(startDay = 1, endDay = 5): number[] {
  const days: number[] = [];
  for (let i = startDay; i <= endDay; i++) {
    days.push(i);
  }
  return days;
}

/**
 * Convert time string (HH:MM) to minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Check if two time slots overlap
 */
export function doTimeSlotsOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);

  return s1 < e2 && s2 < e1;
}
