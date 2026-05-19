import { Request, Response } from 'express';
import { 
  SchoolService, 
  AcademicYearService, 
  ClassService, 
  SectionService,
  SubjectService,
  TeacherService,
  StudentService,
  RoomService 
} from '../services/core.service';
import { AuthRequest } from '../types';

/**
 * School Controller
 */
export class SchoolController {
  static async create(req: AuthRequest, res: Response) {
    const school = await SchoolService.create(req.body);
    
    return res.status(201).json({
      success: true,
      message: 'School created successfully',
      data: school,
    });
  }

  static async findById(req: Request, res: Response) {
    const school = await SchoolService.findById(parseInt(req.params.id));
    
    return res.json({
      success: true,
      data: school,
    });
  }

  static async findAll(req: Request, res: Response) {
    const schools = await SchoolService.findAll();
    
    return res.json({
      success: true,
      data: schools,
    });
  }

  static async update(req: Request, res: Response) {
    const school = await SchoolService.update(parseInt(req.params.id), req.body);
    
    return res.json({
      success: true,
      message: 'School updated successfully',
      data: school,
    });
  }

  static async delete(req: Request, res: Response) {
    await SchoolService.delete(parseInt(req.params.id));
    
    return res.json({
      success: true,
      message: 'School deleted successfully',
    });
  }
}

/**
 * Academic Year Controller
 */
export class AcademicYearController {
  static async create(req: AuthRequest, res: Response) {
    const academicYear = await AcademicYearService.create(req.body);
    
    return res.status(201).json({
      success: true,
      message: 'Academic year created successfully',
      data: academicYear,
    });
  }

  static async findById(req: Request, res: Response) {
    const academicYear = await AcademicYearService.findById(parseInt(req.params.id));
    
    return res.json({
      success: true,
      data: academicYear,
    });
  }

  static async getCurrent(req: Request, res: Response) {
    const academicYear = await AcademicYearService.getCurrent(parseInt(req.params.schoolId));
    
    return res.json({
      success: true,
      data: academicYear,
    });
  }

  static async update(req: Request, res: Response) {
    const academicYear = await AcademicYearService.update(parseInt(req.params.id), req.body);
    
    return res.json({
      success: true,
      message: 'Academic year updated successfully',
      data: academicYear,
    });
  }
}

/**
 * Class Controller
 */
export class ClassController {
  static async create(req: AuthRequest, res: Response) {
    const classEntity = await ClassService.create(req.body);
    
    return res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: classEntity,
    });
  }

  static async findById(req: Request, res: Response) {
    const classEntity = await ClassService.findById(parseInt(req.params.id));
    
    return res.json({
      success: true,
      data: classEntity,
    });
  }

  static async update(req: Request, res: Response) {
    const classEntity = await ClassService.update(parseInt(req.params.id), req.body);
    
    return res.json({
      success: true,
      message: 'Class updated successfully',
      data: classEntity,
    });
  }

  static async delete(req: Request, res: Response) {
    await ClassService.delete(parseInt(req.params.id));
    
    return res.json({
      success: true,
      message: 'Class deleted successfully',
    });
  }
}

/**
 * Section Controller
 */
export class SectionController {
  static async create(req: AuthRequest, res: Response) {
    const section = await SectionService.create(req.body);
    
    return res.status(201).json({
      success: true,
      message: 'Section created successfully',
      data: section,
    });
  }

  static async findById(req: Request, res: Response) {
    const section = await SectionService.findById(parseInt(req.params.id));
    
    return res.json({
      success: true,
      data: section,
    });
  }

  static async update(req: Request, res: Response) {
    const section = await SectionService.update(parseInt(req.params.id), req.body);
    
    return res.json({
      success: true,
      message: 'Section updated successfully',
      data: section,
    });
  }

  static async delete(req: Request, res: Response) {
    await SectionService.delete(parseInt(req.params.id));
    
    return res.json({
      success: true,
      message: 'Section deleted successfully',
    });
  }
}

/**
 * Subject Controller
 */
export class SubjectController {
  static async create(req: AuthRequest, res: Response) {
    const subject = await SubjectService.create(req.body);
    
    return res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject,
    });
  }

  static async findById(req: Request, res: Response) {
    const subject = await SubjectService.findById(parseInt(req.params.id));
    
    return res.json({
      success: true,
      data: subject,
    });
  }

  static async update(req: Request, res: Response) {
    const subject = await SubjectService.update(parseInt(req.params.id), req.body);
    
    return res.json({
      success: true,
      message: 'Subject updated successfully',
      data: subject,
    });
  }

  static async delete(req: Request, res: Response) {
    await SubjectService.delete(parseInt(req.params.id));
    
    return res.json({
      success: true,
      message: 'Subject deleted successfully',
    });
  }
}

/**
 * Teacher Controller
 */
export class TeacherController {
  static async create(req: AuthRequest, res: Response) {
    const teacher = await TeacherService.create(req.body);
    
    return res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: teacher,
    });
  }

  static async findById(req: Request, res: Response) {
    const teacher = await TeacherService.findById(parseInt(req.params.id));
    
    return res.json({
      success: true,
      data: teacher,
    });
  }

  static async update(req: Request, res: Response) {
    const teacher = await TeacherService.update(parseInt(req.params.id), req.body);
    
    return res.json({
      success: true,
      message: 'Teacher updated successfully',
      data: teacher,
    });
  }

  static async delete(req: Request, res: Response) {
    await TeacherService.delete(parseInt(req.params.id));
    
    return res.json({
      success: true,
      message: 'Teacher deleted successfully',
    });
  }
}

/**
 * Student Controller
 */
export class StudentController {
  static async create(req: AuthRequest, res: Response) {
    const student = await StudentService.create(req.body);
    
    return res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student,
    });
  }

  static async findById(req: Request, res: Response) {
    const student = await StudentService.findById(parseInt(req.params.id));
    
    return res.json({
      success: true,
      data: student,
    });
  }

  static async update(req: Request, res: Response) {
    const student = await StudentService.update(parseInt(req.params.id), req.body);
    
    return res.json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  }

  static async delete(req: Request, res: Response) {
    await StudentService.delete(parseInt(req.params.id));
    
    return res.json({
      success: true,
      message: 'Student deleted successfully',
    });
  }
}

/**
 * Room Controller
 */
export class RoomController {
  static async create(req: AuthRequest, res: Response) {
    const room = await RoomService.create(req.body);
    
    return res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room,
    });
  }

  static async findById(req: Request, res: Response) {
    const room = await RoomService.findById(parseInt(req.params.id));
    
    return res.json({
      success: true,
      data: room,
    });
  }

  static async update(req: Request, res: Response) {
    const room = await RoomService.update(parseInt(req.params.id), req.body);
    
    return res.json({
      success: true,
      message: 'Room updated successfully',
      data: room,
    });
  }

  static async delete(req: Request, res: Response) {
    await RoomService.delete(parseInt(req.params.id));
    
    return res.json({
      success: true,
      message: 'Room deleted successfully',
    });
  }
}
