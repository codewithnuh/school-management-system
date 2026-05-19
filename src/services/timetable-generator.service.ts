import { Transaction } from 'sequelize';
import db from '../models';
import { Timetable, Class, Section, Subject, Teacher, Room, TimeSlot, ClassSubject, SectionTeacher } from '../models';
import { validateScheduleEntry } from './timetable-validator.service';
import { scheduleSession } from './timetable-scheduler.service';
import { TimetableConflictError, NotFoundError, ValidationError } from '../errors';

interface AutoScheduleConfig {
  classId: number;
  academicYearId: number;
  workingDays: string[]; // e.g., ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  maxPeriodsPerDay?: number; // Maximum periods per day for a class (default: all available)
}

interface SchedulingTask {
  subjectId: number;
  teacherId: number;
  periodsPerWeek: number;
  priority: number; // Higher priority = schedule first
}

interface ScheduleResult {
  success: boolean;
  scheduledCount: number;
  failedCount: number;
  errors: Array<{
    subjectId: number;
    teacherId: number;
    error: string;
  }>;
  timetable?: Timetable[];
}

/**
 * Get subject requirements for a class
 */
async function getSubjectRequirements(
  classId: number,
  academicYearId: number,
  transaction?: Transaction
): Promise<SchedulingTask[]> {
  const classSubjects = await ClassSubject.findAll({
    where: { classId, academicYearId },
    include: [
      {
        model: Subject,
        as: 'subject',
        attributes: ['id', 'name', 'code'],
      },
    ],
    transaction,
  });

  const tasks: SchedulingTask[] = [];

  for (const cs of classSubjects) {
    // Find eligible teachers for this subject
    const sectionTeachers = await SectionTeacher.findAll({
      include: [
        {
          model: Section,
          as: 'section',
          where: { classId },
        },
        {
          model: Teacher,
          as: 'teacher',
          include: [
            {
              model: Subject,
              as: 'subjects',
              where: { id: cs.subjectId },
            },
          ],
        },
      ],
      transaction,
    });

    if (sectionTeachers.length > 0) {
      // Use the first eligible teacher (could be enhanced with load balancing)
      const teacher = sectionTeachers[0].teacher;
      
      tasks.push({
        subjectId: cs.subjectId,
        teacherId: teacher.id,
        periodsPerWeek: cs.periodsPerWeek || 1,
        priority: cs.priority || 0,
      });
    } else {
      throw new ValidationError(
        `No eligible teacher found for subject ${cs.subjectId} in class ${classId}`
      );
    }
  }

  // Sort by priority (higher priority first)
  return tasks.sort((a, b) => b.priority - a.priority);
}

/**
 * Get available sections for a class
 */
async function getClassSections(
  classId: number,
  transaction?: Transaction
): Promise<Section[]> {
  return await Section.findAll({
    where: { classId },
    transaction,
  });
}

/**
 * Try to schedule a single period using backtracking
 */
async function trySchedulePeriod(
  task: SchedulingTask,
  classId: number,
  sectionId: number,
  workingDays: string[],
  timeSlots: TimeSlot[],
  transaction: Transaction,
  attempt: number = 0
): Promise<Timetable | null> {
  const maxAttempts = workingDays.length * timeSlots.length;
  
  if (attempt >= maxAttempts) {
    return null; // No available slot found
  }

  // Try each day and time slot combination
  for (const day of workingDays) {
    for (const timeSlot of timeSlots) {
      try {
        const request = {
          classId,
          sectionId,
          subjectId: task.subjectId,
          teacherId: task.teacherId,
          dayOfWeek: day as any,
          timeSlotId: timeSlot.id,
        };

        // Validate without room assignment first (can be optimized later)
        const validation = await validateScheduleEntry(request, undefined, transaction);
        
        if (validation.valid) {
          const result = await scheduleSession(request, transaction);
          
          if (result.success && result.timetable) {
            return result.timetable;
          }
        }
      } catch (error) {
        // Conflict detected, try next slot
        continue;
      }
    }
  }

  return null;
}

/**
 * Auto-generate timetable for a class using backtracking algorithm
 */
export async function generateTimetableForClass(
  config: AutoScheduleConfig,
  transaction?: Transaction
): Promise<ScheduleResult> {
  const externalTransaction = !!transaction;
  let txn: Transaction | undefined = transaction;

  if (!externalTransaction) {
    txn = await db.sequelize.transaction();
  }

  try {
    const { classId, academicYearId, workingDays } = config;
    const maxPeriodsPerDay = config.maxPeriodsPerDay || 10; // Default max

    // Verify class exists
    const classEntity = await Class.findByPk(classId, { transaction: txn });
    if (!classEntity) {
      throw new NotFoundError('Class');
    }

    // Get all time slots for the academic year
    const timeSlots = await TimeSlot.findAll({
      where: { academicYearId },
      order: [['periodNumber', 'ASC']],
      transaction: txn,
    });

    if (timeSlots.length === 0) {
      throw new ValidationError('No time slots defined for this academic year');
    }

    // Get sections for this class
    const sections = await getClassSections(classId, txn);
    
    if (sections.length === 0) {
      throw new ValidationError(`No sections found for class ${classId}`);
    }

    // Get subject requirements
    const tasks = await getSubjectRequirements(classId, academicYearId, txn);
    
    if (tasks.length === 0) {
      throw new ValidationError('No subjects configured for this class');
    }

    const scheduledEntries: Timetable[] = [];
    const errors: Array<{ subjectId: number; teacherId: number; error: string }> = [];
    let scheduledCount = 0;
    let failedCount = 0;

    // Schedule for each section
    for (const section of sections) {
      // Calculate total periods needed
      const totalPeriodsNeeded = tasks.reduce(
        (sum, task) => sum + task.periodsPerWeek,
        0
      );

      const maxPeriodsAvailable = workingDays.length * Math.min(maxPeriodsPerDay, timeSlots.length);

      if (totalPeriodsNeeded > maxPeriodsAvailable) {
        errors.push({
          subjectId: 0,
          teacherId: 0,
          error: `Total periods (${totalPeriodsNeeded}) exceed available slots (${maxPeriodsAvailable}) for section ${section.name}`,
        });
        failedCount += tasks.length;
        continue;
      }

      // Schedule each subject's periods
      for (const task of tasks) {
        let periodsScheduled = 0;

        for (let i = 0; i < task.periodsPerWeek; i++) {
          try {
            const entry = await trySchedulePeriod(
              task,
              classId,
              section.id,
              workingDays,
              timeSlots,
              txn!
            );

            if (entry) {
              scheduledEntries.push(entry);
              periodsScheduled++;
              scheduledCount++;
            } else {
              errors.push({
                subjectId: task.subjectId,
                teacherId: task.teacherId,
                error: `Could not schedule period ${i + 1}/${task.periodsPerWeek} for subject ${task.subjectId}`,
              });
              failedCount++;
            }
          } catch (error) {
            errors.push({
              subjectId: task.subjectId,
              teacherId: task.teacherId,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
            failedCount++;
          }
        }
      }
    }

    // Commit transaction if successful
    if (!externalTransaction) {
      await txn!.commit();
    }

    return {
      success: failedCount === 0,
      scheduledCount,
      failedCount,
      errors,
      timetable: scheduledEntries,
    };
  } catch (error) {
    // Rollback on error
    if (!externalTransaction && txn) {
      await txn.rollback();
    }

    throw error;
  }
}

/**
 * Generate timetables for multiple classes
 */
export async function generateTimetablesForSchool(
  schoolId: number,
  academicYearId: number,
  workingDays: string[],
  transaction?: Transaction
): Promise<{
  success: boolean;
  results: Array<{ classId: number; result: ScheduleResult }>;
}> {
  const externalTransaction = !!transaction;
  let txn: Transaction | undefined = transaction;

  if (!externalTransaction) {
    txn = await db.sequelize.transaction();
  }

  try {
    // Get all classes for this school
    const classes = await Class.findAll({
      where: { schoolId },
      transaction: txn,
    });

    const results: Array<{ classId: number; result: ScheduleResult }> = [];
    let overallSuccess = true;

    for (const cls of classes) {
      try {
        const result = await generateTimetableForClass(
          {
            classId: cls.id,
            academicYearId,
            workingDays,
          },
          txn!
        );

        results.push({ classId: cls.id, result });

        if (!result.success) {
          overallSuccess = false;
        }
      } catch (error) {
        results.push({
          classId: cls.id,
          result: {
            success: false,
            scheduledCount: 0,
            failedCount: 1,
            errors: [{
              subjectId: 0,
              teacherId: 0,
              error: error instanceof Error ? error.message : 'Unknown error',
            }],
          },
        });
        overallSuccess = false;
      }
    }

    // Commit or rollback based on overall success
    if (!externalTransaction) {
      if (overallSuccess) {
        await txn!.commit();
      } else {
        await txn!.rollback();
      }
    }

    return {
      success: overallSuccess,
      results,
    };
  } catch (error) {
    if (!externalTransaction && txn) {
      await txn.rollback();
    }
    throw error;
  }
}

/**
 * Clear all timetable entries for a class
 */
export async function clearTimetableForClass(
  classId: number,
  academicYearId: number,
  transaction?: Transaction
): Promise<{ success: boolean; deletedCount: number }> {
  try {
    const deleted = await Timetable.destroy({
      where: {
        classId,
      },
      transaction,
    });

    return {
      success: true,
      deletedCount: deleted,
    };
  } catch (error) {
    throw new Error(`Failed to clear timetable: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate timetable completeness for a class
 */
export async function validateTimetableCompleteness(
  classId: number,
  academicYearId: number,
  workingDays: string[],
  transaction?: Transaction
): Promise<{
  isValid: boolean;
  missingPeriods: Array<{
    subjectId: number;
    required: number;
    scheduled: number;
  }>;
  totalScheduled: number;
  totalRequired: number;
}> {
  const classSubjects = await ClassSubject.findAll({
    where: { classId, academicYearId },
    transaction,
  });

  const existingTimetable = await Timetable.findAll({
    where: { classId },
    transaction,
  });

  const missingPeriods: Array<{
    subjectId: number;
    required: number;
    scheduled: number;
  }> = [];

  let totalRequired = 0;
  let totalScheduled = existingTimetable.length;

  for (const cs of classSubjects) {
    const required = cs.periodsPerWeek || 0;
    totalRequired += required;

    const scheduled = existingTimetable.filter(
      t => t.subjectId === cs.subjectId
    ).length;

    if (scheduled < required) {
      missingPeriods.push({
        subjectId: cs.subjectId,
        required,
        scheduled,
      });
    }
  }

  return {
    isValid: missingPeriods.length === 0,
    missingPeriods,
    totalScheduled,
    totalRequired,
  };
}
