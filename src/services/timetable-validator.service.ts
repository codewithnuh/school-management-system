import { Op, Transaction } from 'sequelize';
import db from '../models';
import { Timetable, TimeSlot, Class, Section, Subject, Teacher, Room } from '../models';
import { TimetableConflictError, NotFoundError, ValidationError } from '../errors';
import { z } from 'zod';

// Validation schemas
const ScheduleEntrySchema = z.object({
  classId: z.number().int().positive(),
  sectionId: z.number().int().positive(),
  subjectId: z.number().int().positive(),
  teacherId: z.number().int().positive(),
  roomId: z.number().int().positive().optional(),
  dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  timeSlotId: z.number().int().positive(),
});

type ScheduleEntry = z.infer<typeof ScheduleEntrySchema>;

interface ConflictCheck {
  hasConflict: boolean;
  conflictType?: 'teacher' | 'room' | 'class' | 'subject';
  conflictingEntity?: {
    type: string;
    id: number;
    name?: string;
  };
}

/**
 * Check if a teacher is available at a specific time slot
 */
export async function checkTeacherAvailability(
  teacherId: number,
  dayOfWeek: string,
  timeSlotId: number,
  excludeTimetableId?: number,
  transaction?: Transaction
): Promise<ConflictCheck> {
  const whereClause: any = {
    teacherId,
    dayOfWeek,
    timeSlotId,
  };

  if (excludeTimetableId) {
    whereClause.id = { [Op.ne]: excludeTimetableId };
  }

  const conflict = await Timetable.findOne({
    where: whereClause,
    include: [{
      model: Subject,
      as: 'subject',
      attributes: ['id', 'name'],
    }],
    transaction,
  });

  if (conflict) {
    return {
      hasConflict: true,
      conflictType: 'teacher',
      conflictingEntity: {
        type: 'timetable',
        id: conflict.id,
        name: conflict.subject?.name,
      },
    };
  }

  return { hasConflict: false };
}

/**
 * Check if a room is available at a specific time slot
 */
export async function checkRoomAvailability(
  roomId: number,
  dayOfWeek: string,
  timeSlotId: number,
  excludeTimetableId?: number,
  transaction?: Transaction
): Promise<ConflictCheck> {
  const whereClause: any = {
    roomId,
    dayOfWeek,
    timeSlotId,
  };

  if (excludeTimetableId) {
    whereClause.id = { [Op.ne]: excludeTimetableId };
  }

  const conflict = await Timetable.findOne({
    where: whereClause,
    include: [{
      model: Class,
      as: 'class',
      attributes: ['id', 'name'],
    }],
    transaction,
  });

  if (conflict) {
    return {
      hasConflict: true,
      conflictType: 'room',
      conflictingEntity: {
        type: 'class',
        id: conflict.classId,
        name: conflict.class?.name,
      },
    };
  }

  return { hasConflict: false };
}

/**
 * Check if a class/section is already scheduled at a specific time slot
 */
export async function checkClassAvailability(
  classId: number,
  sectionId: number,
  dayOfWeek: string,
  timeSlotId: number,
  excludeTimetableId?: number,
  transaction?: Transaction
): Promise<ConflictCheck> {
  const whereClause: any = {
    classId,
    sectionId,
    dayOfWeek,
    timeSlotId,
  };

  if (excludeTimetableId) {
    whereClause.id = { [Op.ne]: excludeTimetableId };
  }

  const conflict = await Timetable.findOne({
    where: whereClause,
    include: [{
      model: Subject,
      as: 'subject',
      attributes: ['id', 'name'],
    }],
    transaction,
  });

  if (conflict) {
    return {
      hasConflict: true,
      conflictType: 'class',
      conflictingEntity: {
        type: 'subject',
        id: conflict.subjectId,
        name: conflict.subject?.name,
      },
    };
  }

  return { hasConflict: false };
}

/**
 * Validate all constraints for a schedule entry
 */
export async function validateScheduleEntry(
  entry: ScheduleEntry,
  excludeTimetableId?: number,
  transaction?: Transaction
): Promise<{ valid: boolean; errors: string[]; conflicts: any[] }> {
  const errors: string[] = [];
  const conflicts: any[] = [];

  // Validate input schema
  const validation = ScheduleEntrySchema.safeParse(entry);
  if (!validation.success) {
    errors.push(...validation.error.errors.map(e => e.message));
    return { valid: false, errors, conflicts };
  }

  // Check teacher availability
  const teacherConflict = await checkTeacherAvailability(
    entry.teacherId,
    entry.dayOfWeek,
    entry.timeSlotId,
    excludeTimetableId,
    transaction
  );

  if (teacherConflict.hasConflict) {
    conflicts.push({
      type: 'teacher',
      entityId: entry.teacherId,
      timeSlotId: entry.timeSlotId,
      day: entry.dayOfWeek,
      details: teacherConflict.conflictingEntity,
    });
    errors.push(`Teacher ${entry.teacherId} is not available at ${entry.dayOfWeek} slot ${entry.timeSlotId}`);
  }

  // Check room availability if roomId provided
  if (entry.roomId) {
    const roomConflict = await checkRoomAvailability(
      entry.roomId,
      entry.dayOfWeek,
      entry.timeSlotId,
      excludeTimetableId,
      transaction
    );

    if (roomConflict.hasConflict) {
      conflicts.push({
        type: 'room',
        entityId: entry.roomId,
        timeSlotId: entry.timeSlotId,
        day: entry.dayOfWeek,
        details: roomConflict.conflictingEntity,
      });
      errors.push(`Room ${entry.roomId} is not available at ${entry.dayOfWeek} slot ${entry.timeSlotId}`);
    }
  }

  // Check class availability
  const classConflict = await checkClassAvailability(
    entry.classId,
    entry.sectionId,
    entry.dayOfWeek,
    entry.timeSlotId,
    excludeTimetableId,
    transaction
  );

  if (classConflict.hasConflict) {
    conflicts.push({
      type: 'class',
      entityId: entry.classId,
      timeSlotId: entry.timeSlotId,
      day: entry.dayOfWeek,
      details: classConflict.conflictingEntity,
    });
    errors.push(`Class ${entry.classId} Section ${entry.sectionId} already has a session at ${entry.dayOfWeek} slot ${entry.timeSlotId}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    conflicts,
  };
}

/**
 * Get all available time slots for a teacher on a specific day
 */
export async function getAvailableSlotsForTeacher(
  teacherId: number,
  dayOfWeek: string,
  academicYearId: number,
  transaction?: Transaction
): Promise<number[]> {
  const allSlots = await TimeSlot.findAll({
    where: { academicYearId },
    order: [['period_number', 'ASC']],
    transaction,
  });

  const bookedSlots = await Timetable.findAll({
    where: {
      teacherId,
      dayOfWeek,
    },
    attributes: ['timeSlotId'],
    transaction,
  });

  const bookedSlotIds = new Set(bookedSlots.map(s => s.timeSlotId));
  
  return allSlots
    .filter(slot => !bookedSlotIds.has(slot.id))
    .map(slot => slot.id);
}

/**
 * Get all available time slots for a class/section on a specific day
 */
export async function getAvailableSlotsForClass(
  classId: number,
  sectionId: number,
  dayOfWeek: string,
  academicYearId: number,
  transaction?: Transaction
): Promise<number[]> {
  const allSlots = await TimeSlot.findAll({
    where: { academicYearId },
    order: [['period_number', 'ASC']],
    transaction,
  });

  const bookedSlots = await Timetable.findAll({
    where: {
      classId,
      sectionId,
      dayOfWeek,
    },
    attributes: ['timeSlotId'],
    transaction,
  });

  const bookedSlotIds = new Set(bookedSlots.map(s => s.timeSlotId));
  
  return allSlots
    .filter(slot => !bookedSlotIds.has(slot.id))
    .map(slot => slot.id);
}

/**
 * Get all available time slots for a room on a specific day
 */
export async function getAvailableSlotsForRoom(
  roomId: number,
  dayOfWeek: string,
  academicYearId: number,
  transaction?: Transaction
): Promise<number[]> {
  const allSlots = await TimeSlot.findAll({
    where: { academicYearId },
    order: [['period_number', 'ASC']],
    transaction,
  });

  const bookedSlots = await Timetable.findAll({
    where: {
      roomId,
      dayOfWeek,
    },
    attributes: ['timeSlotId'],
    transaction,
  });

  const bookedSlotIds = new Set(bookedSlots.map(s => s.timeSlotId));
  
  return allSlots
    .filter(slot => !bookedSlotIds.has(slot.id))
    .map(slot => slot.id);
}
