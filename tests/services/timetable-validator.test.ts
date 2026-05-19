import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TimetableValidatorService } from '../../src/services/timetable-validator.service';
import { TimetableConflictError } from '../../src/errors';

// Mock models
vi.mock('../../src/models', () => ({
  TimetableEntry: {
    findAll: vi.fn()
  },
  Teacher: {
    findByPk: vi.fn()
  },
  Room: {
    findByPk: vi.fn()
  },
  Section: {
    findByPk: vi.fn()
  }
}));

describe('TimetableValidatorService', () => {
  let validator: TimetableValidatorService;

  beforeEach(() => {
    validator = new TimetableValidatorService();
    vi.clearAllMocks();
  });

  describe('checkTeacherConflict', () => {
    it('should return no conflict when teacher is free', async () => {
      const { TimetableEntry } = await import('../../src/models');
      (TimetableEntry.findAll as any).mockResolvedValue([]);

      const conflict = await validator.checkTeacherConflict(1, 'Monday', '09:00', '10:00');
      
      expect(conflict).toBe(false);
      expect(TimetableEntry.findAll).toHaveBeenCalledWith({
        where: expect.objectContaining({
          teacherId: 1,
          dayOfWeek: 'Monday'
        })
      });
    });

    it('should detect conflict when teacher is already assigned', async () => {
      const { TimetableEntry } = await import('../../src/models');
      (TimetableEntry.findAll as any).mockResolvedValue([
        { id: 1, timeSlotId: 1, sectionId: 1 }
      ]);

      const conflict = await validator.checkTeacherConflict(1, 'Monday', '09:00', '10:00');
      
      expect(conflict).toBe(true);
    });
  });

  describe('checkRoomConflict', () => {
    it('should return no conflict when room is free', async () => {
      const { TimetableEntry } = await import('../../src/models');
      (TimetableEntry.findAll as any).mockResolvedValue([]);

      const conflict = await validator.checkRoomConflict(1, 'Monday', '09:00', '10:00');
      
      expect(conflict).toBe(false);
    });

    it('should detect conflict when room is already booked', async () => {
      const { TimetableEntry } = await import('../../src/models');
      (TimetableEntry.findAll as any).mockResolvedValue([
        { id: 1, timeSlotId: 1, sectionId: 1 }
      ]);

      const conflict = await validator.checkRoomConflict(1, 'Monday', '09:00', '10:00');
      
      expect(conflict).toBe(true);
    });
  });

  describe('checkClassConflict', () => {
    it('should return no conflict when class is free', async () => {
      const { TimetableEntry } = await import('../../src/models');
      (TimetableEntry.findAll as any).mockResolvedValue([]);

      const conflict = await validator.checkSectionConflict(1, 'Monday', '09:00', '10:00');
      
      expect(conflict).toBe(false);
    });

    it('should detect conflict when class already has a session', async () => {
      const { TimetableEntry } = await import('../../src/models');
      (TimetableEntry.findAll as any).mockResolvedValue([
        { id: 1, timeSlotId: 1, teacherId: 1 }
      ]);

      const conflict = await validator.checkSectionConflict(1, 'Monday', '09:00', '10:00');
      
      expect(conflict).toBe(true);
    });
  });

  describe('validateTimeSlot', () => {
    it('should validate a time slot with no conflicts', async () => {
      const { TimetableEntry } = await import('../../src/models');
      (TimetableEntry.findAll as any).mockResolvedValue([]);

      const result = await validator.validateTimeSlot({
        teacherId: 1,
        roomId: 1,
        sectionId: 1,
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '10:00'
      });

      expect(result.isValid).toBe(true);
      expect(result.conflicts).toHaveLength(0);
    });

    it('should return all conflicts when multiple exist', async () => {
      const { TimetableEntry } = await import('../../src/models');
      (TimetableEntry.findAll as any)
        .mockResolvedValueOnce([{ id: 1 }]) // Teacher conflict
        .mockResolvedValueOnce([{ id: 2 }]) // Room conflict
        .mockResolvedValueOnce([]); // No class conflict

      const result = await validator.validateTimeSlot({
        teacherId: 1,
        roomId: 1,
        sectionId: 1,
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '10:00'
      });

      expect(result.isValid).toBe(false);
      expect(result.conflicts.length).toBeGreaterThan(0);
    });
  });
});
