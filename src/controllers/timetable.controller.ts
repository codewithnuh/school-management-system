import { Request, Response } from 'express';
import { TimetableService } from '../services/timetable.service';
import { validate } from '../middleware';
import { CreateTimetableSchema, UpdateTimetableSchema } from '../services/validation.service';
import { AuthRequest } from '../types';

/**
 * Timetable Controller
 */
export class TimetableController {
  /**
   * Create a new timetable entry
   * POST /api/timetable
   */
  static async create(req: AuthRequest, res: Response) {
    const result = await TimetableService.createEntry(req.body);
    
    return res.status(201).json({
      success: true,
      message: 'Timetable entry created successfully',
      data: result,
    });
  }

  /**
   * Get timetable for a class and section
   * GET /api/timetable/class/:classId/section/:sectionId
   */
  static async getClassTimetable(req: Request, res: Response) {
    const { classId, sectionId } = req.params;
    const { academicYearId } = req.query;

    const result = await TimetableService.getClassTimetable(
      parseInt(classId),
      parseInt(sectionId),
      academicYearId ? parseInt(academicYearId as string) : undefined
    );

    return res.json({
      success: true,
      data: result,
    });
  }

  /**
   * Get timetable for a teacher
   * GET /api/timetable/teacher/:teacherId
   */
  static async getTeacherTimetable(req: Request, res: Response) {
    const { teacherId } = req.params;
    const { academicYearId } = req.query;

    const result = await TimetableService.getTeacherTimetable(
      parseInt(teacherId),
      academicYearId ? parseInt(academicYearId as string) : undefined
    );

    return res.json({
      success: true,
      data: result,
    });
  }

  /**
   * Get timetable for a room
   * GET /api/timetable/room/:roomId
   */
  static async getRoomTimetable(req: Request, res: Response) {
    const { roomId } = req.params;
    const { academicYearId } = req.query;

    const result = await TimetableService.getRoomTimetable(
      parseInt(roomId),
      academicYearId ? parseInt(academicYearId as string) : undefined
    );

    return res.json({
      success: true,
      data: result,
    });
  }

  /**
   * Update a timetable entry
   * PUT /api/timetable/:id
   */
  static async update(req: Request, res: Response) {
    const { id } = req.params;
    
    const result = await TimetableService.updateEntry(
      parseInt(id),
      req.body
    );

    return res.json({
      success: true,
      message: 'Timetable entry updated successfully',
      data: result,
    });
  }

  /**
   * Delete a timetable entry
   * DELETE /api/timetable/:id
   */
  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    
    await TimetableService.deleteEntry(parseInt(id));

    return res.json({
      success: true,
      message: 'Timetable entry deleted successfully',
    });
  }

  /**
   * Auto-generate timetable for a class
   * POST /api/timetable/generate
   */
  static async generate(req: Request, res: Response) {
    const { classId, academicYearId, workingDays } = req.body;

    const result = await TimetableService.generateTimetable({
      classId,
      academicYearId,
      workingDays,
    });

    return res.json({
      success: result.success,
      message: result.success 
        ? 'Timetable generated successfully' 
        : 'Timetable generation completed with errors',
      data: {
        scheduledCount: result.scheduledCount,
        failedCount: result.failedCount,
        errors: result.errors,
        timetable: result.timetable,
      },
    });
  }

  /**
   * Clear timetable for a class
   * DELETE /api/timetable/class/:classId/clear
   */
  static async clear(req: Request, res: Response) {
    const { classId } = req.params;
    const { academicYearId } = req.query;

    const result = await TimetableService.clearTimetable(
      parseInt(classId),
      academicYearId ? parseInt(academicYearId as string) : undefined
    );

    return res.json({
      success: true,
      message: `Cleared ${result.deletedCount} timetable entries`,
      data: result,
    });
  }

  /**
   * Validate timetable completeness
   * GET /api/timetable/class/:classId/validate
   */
  static async validate(req: Request, res: Response) {
    const { classId } = req.params;
    const { academicYearId, workingDays } = req.query;

    const result = await TimetableService.validateCompleteness(
      parseInt(classId),
      academicYearId ? parseInt(academicYearId as string) : undefined,
      workingDays ? (workingDays as string).split(',') : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    );

    return res.json({
      success: true,
      data: result,
    });
  }

  /**
   * Check availability for scheduling
   * GET /api/timetable/check-availability
   */
  static async checkAvailability(req: Request, res: Response) {
    const { classId, sectionId, subjectId, teacherId, roomId, dayOfWeek, timeSlotId } = req.query;

    const result = await TimetableService.checkAvailability({
      classId: classId ? parseInt(classId as string) : undefined,
      sectionId: sectionId ? parseInt(sectionId as string) : undefined,
      subjectId: subjectId ? parseInt(subjectId as string) : undefined,
      teacherId: teacherId ? parseInt(teacherId as string) : undefined,
      roomId: roomId ? parseInt(roomId as string) : undefined,
      dayOfWeek: dayOfWeek as string,
      timeSlotId: timeSlotId ? parseInt(timeSlotId as string) : undefined,
    });

    return res.json({
      success: true,
      data: result,
    });
  }
}
