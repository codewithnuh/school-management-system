import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TimetableService } from '../../src/services/timetable.service';
import { TimetableConflictError, NotFoundError } from '../../src/errors';

// Mock the services
vi.mock('../../src/services/timetable-scheduler.service', () => ({
  scheduleSession: vi.fn(),
  updateSession: vi.fn(),
  deleteSession: vi.fn(),
  getClassSessions: vi.fn(),
  getTeacherSessions: vi.fn(),
  getRoomSessions: vi.fn(),
}));

vi.mock('../../src/services/timetable-generator.service', () => ({
  generateTimetableForClass: vi.fn(),
  generateTimetablesForSchool: vi.fn(),
  clearTimetableForClass: vi.fn(),
  validateTimetableCompleteness: vi.fn(),
}));

vi.mock('../../src/services/timetable-validator.service', () => ({
  validateScheduleEntry: vi.fn(),
  checkTeacherAvailability: vi.fn(),
  checkRoomAvailability: vi.fn(),
  checkClassAvailability: vi.fn(),
  getAvailableSlotsForTeacher: vi.fn(),
  getAvailableSlotsForClass: vi.fn(),
  getAvailableSlotsForRoom: vi.fn(),
}));

vi.mock('../../src/models', () => ({
  default: {
    AcademicYear: {
      findOne: vi.fn(),
    },
  },
  Timetable: {},
  TimeSlot: {},
  Class: {},
  Section: {},
  Subject: {},
  Teacher: {},
  Room: {},
}));

describe('TimetableService', () => {
  const mockTimetable = {
    id: 1,
    classId: 1,
    sectionId: 1,
    subjectId: 1,
    teacherId: 1,
    roomId: 1,
    dayOfWeek: 'monday',
    timeSlotId: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createEntry', () => {
    it('should create a timetable entry successfully', async () => {
      const { scheduleSession } = await import('../../src/services/timetable-scheduler.service');
      vi.mocked(scheduleSession).mockResolvedValue({
        success: true,
        timetable: mockTimetable as any,
      });

      const result = await TimetableService.createEntry({
        classId: 1,
        sectionId: 1,
        subjectId: 1,
        teacherId: 1,
        dayOfWeek: 'monday',
        timeSlotId: 1,
      });

      expect(result).toEqual(mockTimetable);
      expect(scheduleSession).toHaveBeenCalled();
    });

    it('should throw ValidationError when creation fails', async () => {
      const { scheduleSession } = await import('../../src/services/timetable-scheduler.service');
      vi.mocked(scheduleSession).mockResolvedValue({
        success: false,
        error: 'Teacher not available',
      });

      await expect(
        TimetableService.createEntry({
          classId: 1,
          sectionId: 1,
          subjectId: 1,
          teacherId: 1,
          dayOfWeek: 'monday',
          timeSlotId: 1,
        })
      ).rejects.toThrow('Teacher not available');
    });
  });

  describe('deleteEntry', () => {
    it('should delete a timetable entry successfully', async () => {
      const { deleteSession } = await import('../../src/services/timetable-scheduler.service');
      vi.mocked(deleteSession).mockResolvedValue({ success: true });

      const result = await TimetableService.deleteEntry(1);

      expect(result).toEqual({ success: true });
      expect(deleteSession).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when entry does not exist', async () => {
      const { deleteSession } = await import('../../src/services/timetable-scheduler.service');
      vi.mocked(deleteSession).mockResolvedValue({ 
        success: false, 
        error: 'Timetable entry not found' 
      });

      await expect(TimetableService.deleteEntry(999))
        .rejects.toThrow('Timetable entry');
    });
  });

  describe('checkAvailability', () => {
    it('should check teacher availability', async () => {
      const { checkTeacherAvailability } = await import('../../src/services/timetable-validator.service');
      vi.mocked(checkTeacherAvailability).mockResolvedValue({ hasConflict: false });

      const result = await TimetableService.checkAvailability({
        teacherId: 1,
        dayOfWeek: 'monday',
        timeSlotId: 1,
      });

      expect(result.available).toBe(true);
      expect(result.teacher).toEqual({
        id: 1,
        available: true,
        conflict: undefined,
      });
      expect(checkTeacherAvailability).toHaveBeenCalledWith(1, 'monday', 1);
    });

    it('should detect teacher conflict', async () => {
      const { checkTeacherAvailability } = await import('../../src/services/timetable-validator.service');
      vi.mocked(checkTeacherAvailability).mockResolvedValue({
        hasConflict: true,
        conflictType: 'teacher',
        conflictingEntity: { type: 'timetable', id: 5, name: 'Math' },
      });

      const result = await TimetableService.checkAvailability({
        teacherId: 1,
        dayOfWeek: 'monday',
        timeSlotId: 1,
      });

      expect(result.available).toBe(false);
      expect(result.conflicts).toHaveLength(1);
      expect(result.conflicts[0].type).toBe('teacher');
    });

    it('should check multiple availabilities', async () => {
      const { checkTeacherAvailability, checkRoomAvailability, checkClassAvailability } = 
        await import('../../src/services/timetable-validator.service');
      
      vi.mocked(checkTeacherAvailability).mockResolvedValue({ hasConflict: false });
      vi.mocked(checkRoomAvailability).mockResolvedValue({ hasConflict: true, conflictType: 'room' });
      vi.mocked(checkClassAvailability).mockResolvedValue({ hasConflict: false });

      const result = await TimetableService.checkAvailability({
        classId: 1,
        sectionId: 1,
        teacherId: 1,
        roomId: 1,
        dayOfWeek: 'monday',
        timeSlotId: 1,
      });

      expect(result.available).toBe(false);
      expect(result.conflicts).toHaveLength(1);
      expect(result.conflicts[0].type).toBe('room');
    });
  });
});
