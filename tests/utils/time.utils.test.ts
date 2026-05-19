import { describe, it, expect } from 'vitest';
import { generateTimeSlotLabel, isWeekend, getWorkingDays, timeToMinutes, doTimeSlotsOverlap } from '../../src/utils/time.utils';

describe('Time Utils', () => {
  describe('generateTimeSlotLabel', () => {
    it('should generate correct label for morning slots', () => {
      expect(generateTimeSlotLabel('08:00', '08:45')).toBe('08:00 - 08:45');
    });

    it('should handle single digit hours correctly', () => {
      expect(generateTimeSlotLabel('09:00', '09:45')).toBe('09:00 - 09:45');
    });

    it('should handle afternoon slots', () => {
      expect(generateTimeSlotLabel('13:00', '14:00')).toBe('13:00 - 14:00');
    });
  });

  describe('isWeekend', () => {
    it('should return true for Saturday (6)', () => {
      expect(isWeekend(6)).toBe(true);
    });

    it('should return true for Sunday (0)', () => {
      expect(isWeekend(0)).toBe(true);
    });

    it('should return false for weekdays', () => {
      expect(isWeekend(1)).toBe(false); // Monday
      expect(isWeekend(2)).toBe(false); // Tuesday
      expect(isWeekend(3)).toBe(false); // Wednesday
      expect(isWeekend(4)).toBe(false); // Thursday
      expect(isWeekend(5)).toBe(false); // Friday
    });
  });

  describe('getWorkingDays', () => {
    it('should return array of weekdays by default', () => {
      const days = getWorkingDays();
      expect(days).toContain(1); // Monday
      expect(days).toContain(5); // Friday
      expect(days).not.toContain(0); // Sunday
      expect(days).not.toContain(6); // Saturday
      expect(days).toEqual([1, 2, 3, 4, 5]);
    });

    it('should respect custom start and end days', () => {
      const days = getWorkingDays(1, 4); // Mon to Thu
      expect(days).toEqual([1, 2, 3, 4]);
    });

    it('should handle single day range', () => {
      const days = getWorkingDays(3, 3); // Only Wednesday
      expect(days).toEqual([3]);
    });
  });

  describe('timeToMinutes', () => {
    it('should convert morning time correctly', () => {
      expect(timeToMinutes('08:00')).toBe(480); // 8 * 60
      expect(timeToMinutes('08:30')).toBe(510); // 8 * 60 + 30
    });

    it('should convert afternoon time correctly', () => {
      expect(timeToMinutes('13:00')).toBe(780); // 13 * 60
      expect(timeToMinutes('15:45')).toBe(945); // 15 * 60 + 45
    });

    it('should handle midnight', () => {
      expect(timeToMinutes('00:00')).toBe(0);
    });
  });

  describe('doTimeSlotsOverlap', () => {
    it('should detect overlapping slots', () => {
      expect(doTimeSlotsOverlap('08:00', '09:00', '08:30', '09:30')).toBe(true);
      expect(doTimeSlotsOverlap('08:00', '10:00', '09:00', '09:30')).toBe(true);
    });

    it('should detect non-overlapping slots', () => {
      expect(doTimeSlotsOverlap('08:00', '09:00', '09:00', '10:00')).toBe(false);
      expect(doTimeSlotsOverlap('08:00', '09:00', '10:00', '11:00')).toBe(false);
    });

    it('should handle identical slots as overlapping', () => {
      expect(doTimeSlotsOverlap('08:00', '09:00', '08:00', '09:00')).toBe(true);
    });

    it('should handle one slot contained within another', () => {
      expect(doTimeSlotsOverlap('08:00', '10:00', '08:30', '09:30')).toBe(true);
    });
  });
});
