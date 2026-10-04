import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    schoolId?: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface ApiError {
  field?: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  errors?: ApiError[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Re-export validation types
export type {
  CreateSchoolInput,
  UpdateSchoolInput,
  CreateUserInput,
  UpdateUserInput,
  CreateAcademicYearInput,
  UpdateAcademicYearInput,
  CreateClassInput,
  UpdateClassInput,
  CreateSectionInput,
  UpdateSectionInput,
  CreateSubjectInput,
  UpdateSubjectInput,
  CreateTeacherInput,
  UpdateTeacherInput,
  CreateStudentInput,
  UpdateStudentInput,
  CreateParentInput,
  UpdateParentInput,
  CreateRoomInput,
  UpdateRoomInput,
  CreateTimeSlotInput,
  UpdateTimeSlotInput,
  CreateClassSubjectInput,
  UpdateClassSubjectInput,
  CreateSectionTeacherInput,
  UpdateSectionTeacherInput,
  CreateTimetableInput,
  UpdateTimetableInput,
  CreateStudentParentInput,
  UpdateStudentParentInput,
  CreateExamInput,
  UpdateExamInput,
  CreateExamSubjectInput,
  UpdateExamSubjectInput,
  CreateStudentExamInput,
  UpdateStudentExamInput,
  PaginationInput,
  FilterInput,
} from '../services/validation.service';
