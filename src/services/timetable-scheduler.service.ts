import { Transaction } from 'sequelize';
import db from '../models';
import { Timetable, ClassSubject, SectionTeacher, TimeSlot } from '../models';
import { validateScheduleEntry } from './timetable-validator.service';
import { TimetableConflictError, NotFoundError } from '../errors';

interface SchedulingRequest {
  classId: number;
  sectionId: number;
  subjectId: number;
  teacherId: number;
  roomId?: number;
  dayOfWeek: string;
  timeSlotId: number;
}

interface SchedulingResult {
  success: boolean;
  timetable?: Timetable;
  error?: string;
}

/**
 * Schedule a single class session with conflict detection
 */
export async function scheduleSession(
  request: SchedulingRequest,
  transaction?: Transaction
): Promise<SchedulingResult> {
  try {
    // Validate the scheduling request
    const validation = await validateScheduleEntry(request, undefined, transaction);
    
    if (!validation.valid) {
      throw new TimetableConflictError(
        'Cannot schedule session due to conflicts',
        validation.conflicts
      );
    }

    // Create the timetable entry
    const timetable = await Timetable.create(
      {
        classId: request.classId,
        sectionId: request.sectionId,
        subjectId: request.subjectId,
        teacherId: request.teacherId,
        roomId: request.roomId,
        dayOfWeek: request.dayOfWeek,
        timeSlotId: request.timeSlotId,
      },
      { transaction }
    );

    return {
      success: true,
      timetable,
    };
  } catch (error) {
    if (error instanceof TimetableConflictError) {
      throw error;
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Update an existing timetable entry with conflict detection
 */
export async function updateSession(
  timetableId: number,
  updates: Partial<SchedulingRequest>,
  transaction?: Transaction
): Promise<SchedulingResult> {
  try {
    // Find existing timetable entry
    const existing = await Timetable.findByPk(timetableId, { transaction });
    
    if (!existing) {
      throw new NotFoundError('Timetable entry');
    }

    // Merge updates with existing data
    const updatedRequest = {
      classId: updates.classId ?? existing.classId,
      sectionId: updates.sectionId ?? existing.sectionId,
      subjectId: updates.subjectId ?? existing.subjectId,
      teacherId: updates.teacherId ?? existing.teacherId,
      roomId: updates.roomId ?? existing.roomId,
      dayOfWeek: updates.dayOfWeek ?? existing.dayOfWeek,
      timeSlotId: updates.timeSlotId ?? existing.timeSlotId,
    };

    // Validate with exclusion of current entry
    const validation = await validateScheduleEntry(updatedRequest, timetableId, transaction);
    
    if (!validation.valid) {
      throw new TimetableConflictError(
        'Cannot update session due to conflicts',
        validation.conflicts
      );
    }

    // Update the timetable entry
    await existing.update(updatedRequest, { transaction });

    return {
      success: true,
      timetable: existing,
    };
  } catch (error) {
    if (error instanceof TimetableConflictError || error instanceof NotFoundError) {
      throw error;
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Delete a timetable entry
 */
export async function deleteSession(
  timetableId: number,
  transaction?: Transaction
): Promise<{ success: boolean; error?: string }> {
  try {
    const timetable = await Timetable.findByPk(timetableId, { transaction });
    
    if (!timetable) {
      throw new NotFoundError('Timetable entry');
    }

    await timetable.destroy({ transaction });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Batch schedule multiple sessions with rollback on any conflict
 */
export async function batchScheduleSessions(
  requests: SchedulingRequest[],
  transaction?: Transaction
): Promise<{ success: boolean; results: SchedulingResult[]; error?: string }> {
  const results: SchedulingResult[] = [];
  
  try {
    for (const request of requests) {
      const result = await scheduleSession(request, transaction);
      results.push(result);
      
      if (!result.success) {
        throw new Error(`Failed to schedule session: ${result.error}`);
      }
    }

    return {
      success: true,
      results,
    };
  } catch (error) {
    // If not in a transaction, we can't rollback
    // The caller should manage transactions for batch operations
    return {
      success: false,
      results,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get all sessions for a specific class and section
 */
export async function getClassSessions(
  classId: number,
  sectionId: number,
  academicYearId: number,
  transaction?: Transaction
): Promise<Timetable[]> {
  return await Timetable.findAll({
    where: {
      classId,
      sectionId,
    },
    include: [
      {
        model: db.Subject,
        as: 'subject',
        attributes: ['id', 'name', 'code'],
      },
      {
        model: db.Teacher,
        as: 'teacher',
        include: [{
          model: db.User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        }],
      },
      {
        model: db.Room,
        as: 'room',
        attributes: ['id', 'name', 'capacity'],
      },
      {
        model: db.TimeSlot,
        as: 'timeSlot',
        where: { academicYearId },
        attributes: ['id', 'startTime', 'endTime', 'periodNumber'],
      },
    ],
    order: [
      ['dayOfWeek', 'ASC'],
      [{ model: db.TimeSlot, as: 'timeSlot' }, 'periodNumber', 'ASC'],
    ],
    transaction,
  });
}

/**
 * Get all sessions for a specific teacher
 */
export async function getTeacherSessions(
  teacherId: number,
  academicYearId: number,
  transaction?: Transaction
): Promise<Timetable[]> {
  return await Timetable.findAll({
    where: {
      teacherId,
    },
    include: [
      {
        model: db.Class,
        as: 'class',
        attributes: ['id', 'name'],
      },
      {
        model: db.Section,
        as: 'section',
        attributes: ['id', 'name'],
      },
      {
        model: db.Subject,
        as: 'subject',
        attributes: ['id', 'name', 'code'],
      },
      {
        model: db.Room,
        as: 'room',
        attributes: ['id', 'name', 'capacity'],
      },
      {
        model: db.TimeSlot,
        as: 'timeSlot',
        where: { academicYearId },
        attributes: ['id', 'startTime', 'endTime', 'periodNumber'],
      },
    ],
    order: [
      ['dayOfWeek', 'ASC'],
      [{ model: db.TimeSlot, as: 'timeSlot' }, 'periodNumber', 'ASC'],
    ],
    transaction,
  });
}

/**
 * Get all sessions for a specific room
 */
export async function getRoomSessions(
  roomId: number,
  academicYearId: number,
  transaction?: Transaction
): Promise<Timetable[]> {
  return await Timetable.findAll({
    where: {
      roomId,
    },
    include: [
      {
        model: db.Class,
        as: 'class',
        attributes: ['id', 'name'],
      },
      {
        model: db.Section,
        as: 'section',
        attributes: ['id', 'name'],
      },
      {
        model: db.Subject,
        as: 'subject',
        attributes: ['id', 'name', 'code'],
      },
      {
        model: db.Teacher,
        as: 'teacher',
        include: [{
          model: db.User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        }],
      },
      {
        model: db.TimeSlot,
        as: 'timeSlot',
        where: { academicYearId },
        attributes: ['id', 'startTime', 'endTime', 'periodNumber'],
      },
    ],
    order: [
      ['dayOfWeek', 'ASC'],
      [{ model: db.TimeSlot, as: 'timeSlot' }, 'periodNumber', 'ASC'],
    ],
    transaction,
  });
}
