import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppError, TimetableConflictError } from '../../src/errors';

describe('Errors', () => {
  describe('AppError', () => {
    it('should create an error with message and status code', () => {
      const error = new AppError('Test error', 400);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
    });

    it('should default to 500 status code', () => {
      const error = new AppError('Server error');
      expect(error.statusCode).toBe(500);
    });

    it('should include stack trace', () => {
      const error = new AppError('Test error');
      expect(error.stack).toBeDefined();
    });
  });

  describe('TimetableConflictError', () => {
    it('should create error with conflict details', () => {
      const conflicts = [
        { type: 'teacher', id: 1, reason: 'Already assigned' },
        { type: 'room', id: 2, reason: 'Double booked' }
      ];
      const error = new TimetableConflictError(conflicts);
      
      expect(error.message).toContain('Timetable conflict detected');
      expect(error.conflicts).toEqual(conflicts);
      expect(error.statusCode).toBe(409);
    });

    it('should handle empty conflicts array', () => {
      const error = new TimetableConflictError([]);
      expect(error.conflicts).toEqual([]);
    });
  });
});
