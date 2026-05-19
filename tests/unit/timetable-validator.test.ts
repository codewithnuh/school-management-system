import { describe, it, expect, beforeEach } from 'vitest';
import { 
  checkTeacherAvailability,
  checkRoomAvailability,
  checkClassAvailability,
  validateScheduleEntry 
} from '../../src/services/timetable-validator.service';

// Mock database models
const mockTimetable = {
  findOne: vi.fn(),
};

vi.mock('../../src/models', () => ({
  default: {},
  Timetable: mockTimetable,
  TimeSlot: { findAll: vi.fn() },
  Class: {},
  Section: {},
  Subject: {},
  Teacher: {},
  Room: {},
}));

describe('Timetable Validator Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkTeacherAvailability', () => {
    it('should return no conflict when teacher is available', async () => {
      mockTimetable.findOne.mockResolvedValue(null);

      const result = await checkTeacherAvailability(1, 'monday', 1);

      expect(result.hasConflict).toBe(false);
      expect(mockTimetable.findOne).toHaveBeenCalledWith({
        where: {
          teacherId: 1,
          dayOfWeek: 'monday',
          timeSlotId: 1,
        },
        include: expect.anything(),
        transaction: undefined,
      });
    });

    it('should return conflict when teacher is already scheduled', async () => {
      mockTimetable.findOne.mockResolvedValue({
        id: 5,
        subject: { name: 'Mathematics' },
      });

      const result = await checkTeacherAvailability(1, 'monday', 1);

      expect(result.hasConflict).toBe(true);
      expect(result.conflictType).toBe('teacher');
      expect(result.conflictingEntity).toEqual({
        type: 'timetable',
        id: 5,
        name: 'Mathematics',
      });
    });

    it('should exclude specific timetable entry when provided', async () => {
      mockTimetable.findOne.mockResolvedValue(null);

      await checkTeacherAvailability(1, 'monday', 1, 10);

      expect(mockTimetable.findOne).toHaveBeenCalledWith({
        where: {
          teacherId: 1,
          dayOfWeek: 'monday',
          timeSlotId: 1,
          id: { [Symbol.for('Op.ne')]: 10 },
        },
        include: expect.anything(),
        transaction: undefined,
      });
    });
  });

  describe('checkRoomAvailability', () => {
    it('should return no conflict when room is available', async () => {
      mockTimetable.findOne.mockResolvedValue(null);

      const result = await checkRoomAvailability(101, 'monday', 1);

      expect(result.hasConflict).toBe(false);
    });

    it('should return conflict when room is already booked', async () => {
      mockTimetable.findOne.mockResolvedValue({
        classId: 5,
        class: { name: 'Class 10-A' },
      });

      const result = await checkRoomAvailability(101, 'monday', 1);

      expect(result.hasConflict).toBe(true);
      expect(result.conflictType).toBe('room');
      expect(result.conflictingEntity).toEqual({
        type: 'class',
        id: 5,
        name: 'Class 10-A',
      });
    });
  });

  describe('checkClassAvailability', () => {
    it('should return no conflict when class is free', async () => {
      mockTimetable.findOne.mockResolvedValue(null);

      const result = await checkClassAvailability(1, 1, 'monday', 1);

      expect(result.hasConflict).toBe(false);
    });

    it('should return conflict when class already has a session', async () => {
      mockTimetable.findOne.mockResolvedValue({
        subjectId: 3,
        subject: { name: 'Physics' },
      });

      const result = await checkClassAvailability(1, 1, 'monday', 1);

      expect(result.hasConflict).toBe(true);
      expect(result.conflictType).toBe('class');
      expect(result.conflictingEntity).toEqual({
        type: 'subject',
        id: 3,
        name: 'Physics',
      });
    });
  });

  describe('validateScheduleEntry', () => {
    it('should validate a correct schedule entry', async () => {
      mockTimetable.findOne.mockResolvedValue(null);

      const result = await validateScheduleEntry({
        classId: 1,
        sectionId: 1,
        subjectId: 1,
        teacherId: 1,
        roomId: 101,
        dayOfWeek: 'monday',
        timeSlotId: 1,
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.conflicts).toHaveLength(0);
    });

    it('should detect teacher conflict', async () => {
      mockTimetable.findOne
        .mockResolvedValueOnce({ // Teacher conflict
          id: 5,
          subject: { name: 'Math' },
        })
        .mockResolvedValue(null); // No room or class conflict

      const result = await validateScheduleEntry({
        classId: 1,
        sectionId: 1,
        subjectId: 1,
        teacherId: 1,
        roomId: 101,
        dayOfWeek: 'monday',
        timeSlotId: 1,
      });

      expect(result.valid).toBe(false);
      expect(result.conflicts).toHaveLength(1);
      expect(result.conflicts[0].type).toBe('teacher');
    });

    it('should detect multiple conflicts', async () => {
      mockTimetable.findOne
        .mockResolvedValueOnce({ // Teacher conflict
          id: 5,
          subject: { name: 'Math' },
        })
        .mockResolvedValueOnce({ // Room conflict
          classId: 3,
          class: { name: 'Class 9-B' },
        })
        .mockResolvedValue(null); // No class conflict

      const result = await validateScheduleEntry({
        classId: 1,
        sectionId: 1,
        subjectId: 1,
        teacherId: 1,
        roomId: 101,
        dayOfWeek: 'monday',
        timeSlotId: 1,
      });

      expect(result.valid).toBe(false);
      expect(result.conflicts).toHaveLength(2);
      expect(result.conflicts.map(c => c.type)).toContain('teacher');
      expect(result.conflicts.map(c => c.type)).toContain('room');
    });

    it('should reject invalid input data', async () => {
      const result = await validateScheduleEntry({
        classId: -1, // Invalid negative ID
        sectionId: 1,
        subjectId: 1,
        teacherId: 1,
        dayOfWeek: 'invalid_day',
        timeSlotId: 1,
      } as any);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
