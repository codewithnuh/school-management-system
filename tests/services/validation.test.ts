import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ValidationService } from '../../src/services/validation.service';
import { schoolSchema, createTeacherSchema, createStudentSchema } from '../../src/services/validation.service';

describe('ValidationService', () => {
  let validationService: ValidationService;

  beforeEach(() => {
    validationService = new ValidationService();
  });

  describe('schoolSchema', () => {
    it('should validate a correct school object', () => {
      const validSchool = {
        name: 'Test School',
        code: 'TS001',
        address: '123 Test St',
        phone: '+1234567890',
        email: 'test@school.com'
      };

      const result = schoolSchema.safeParse(validSchool);
      expect(result.success).toBe(true);
    });

    it('should fail validation for missing required fields', () => {
      const invalidSchool = { name: 'Test School' };
      
      const result = schoolSchema.safeParse(invalidSchool);
      expect(result.success).toBe(false);
    });

    it('should fail validation for invalid email', () => {
      const invalidSchool = {
        name: 'Test School',
        code: 'TS001',
        email: 'invalid-email'
      };

      const result = schoolSchema.safeParse(invalidSchool);
      expect(result.success).toBe(false);
    });
  });

  describe('createTeacherSchema', () => {
    it('should validate a correct teacher object', () => {
      const validTeacher = {
        userId: 1,
        qualification: 'M.Ed',
        experience: 5,
        specialization: 'Mathematics'
      };

      const result = createTeacherSchema.safeParse(validTeacher);
      expect(result.success).toBe(true);
    });

    it('should fail validation for negative experience', () => {
      const invalidTeacher = {
        userId: 1,
        qualification: 'B.Ed',
        experience: -1
      };

      const result = createTeacherSchema.safeParse(invalidTeacher);
      expect(result.success).toBe(false);
    });
  });

  describe('createStudentSchema', () => {
    it('should validate a correct student object', () => {
      const validStudent = {
        userId: 1,
        admissionNumber: 'ADM2024001',
        dateOfBirth: '2010-05-15',
        gender: 'male',
        bloodGroup: 'A+'
      };

      const result = createStudentSchema.safeParse(validStudent);
      expect(result.success).toBe(true);
    });

    it('should fail validation for invalid gender', () => {
      const invalidStudent = {
        userId: 1,
        admissionNumber: 'ADM2024001',
        dateOfBirth: '2010-05-15',
        gender: 'invalid'
      };

      const result = createStudentSchema.safeParse(invalidStudent);
      expect(result.success).toBe(false);
    });

    it('should fail validation for future date of birth', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      
      const invalidStudent = {
        userId: 1,
        admissionNumber: 'ADM2024001',
        dateOfBirth: futureDate.toISOString().split('T')[0]
      };

      const result = createStudentSchema.safeParse(invalidStudent);
      expect(result.success).toBe(false);
    });
  });

  describe('validateCreateRequest', () => {
    it('should return success for valid data', () => {
      const validData = {
        name: 'Test School',
        code: 'TS001',
        address: '123 Test St',
        phone: '+1234567890',
        email: 'test@school.com'
      };

      const result = validationService.validateCreateRequest('school', validData);
      expect(result.success).toBe(true);
    });

    it('should return error for invalid data', () => {
      const invalidData = { name: 'Test' };

      const result = validationService.validateCreateRequest('school', invalidData);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle unknown entity types', () => {
      const result = validationService.validateCreateRequest('unknown', {});
      expect(result.success).toBe(false);
    });
  });

  describe('validateUpdateRequest', () => {
    it('should allow partial updates', () => {
      const updateData = { email: 'new@school.com' };

      const result = validationService.validateUpdateRequest('school', updateData);
      expect(result.success).toBe(true);
    });

    it('should validate field types in updates', () => {
      const invalidUpdate = { email: 'invalid-email' };

      const result = validationService.validateUpdateRequest('school', invalidUpdate);
      expect(result.success).toBe(false);
    });
  });
});
