import { Transaction } from 'sequelize';
import db from '../models';
import { School, AcademicYear, Class, Section, Subject, Teacher, Student, Parent, Room, User } from '../models';
import { NotFoundError, ValidationError, ConflictError } from '../errors';

/**
 * School Service - Business logic for school management
 */
export class SchoolService {
  /**
   * Create a new school
   */
  static async create(data: any, transaction?: Transaction) {
    const existing = await School.findOne({
      where: { code: data.code },
      transaction,
    });

    if (existing) {
      throw new ConflictError('School with this code already exists');
    }

    return await School.create(data, { transaction });
  }

  /**
   * Get school by ID with related data
   */
  static async findById(id: number, transaction?: Transaction) {
    const school = await School.findByPk(id, {
      include: [
        {
          model: AcademicYear,
          as: 'academicYears',
          attributes: ['id', 'name', 'startDate', 'endDate', 'isCurrent'],
        },
        {
          model: Class,
          as: 'classes',
          attributes: ['id', 'name', 'level'],
        },
      ],
      transaction,
    });

    if (!school) {
      throw new NotFoundError('School');
    }

    return school;
  }

  /**
   * Update school
   */
  static async update(id: number, data: any, transaction?: Transaction) {
    const school = await School.findByPk(id, { transaction });

    if (!school) {
      throw new NotFoundError('School');
    }

    // Check code uniqueness if being updated
    if (data.code && data.code !== school.code) {
      const existing = await School.findOne({
        where: { code: data.code, id: { [db.Sequelize.Op.ne]: id } },
        transaction,
      });

      if (existing) {
        throw new ConflictError('School with this code already exists');
      }
    }

    await school.update(data, { transaction });
    return await this.findById(id, transaction);
  }

  /**
   * Delete school
   */
  static async delete(id: number, transaction?: Transaction) {
    const school = await School.findByPk(id, { transaction });

    if (!school) {
      throw new NotFoundError('School');
    }

    await school.destroy({ transaction });
  }

  /**
   * Get all schools
   */
  static async findAll(transaction?: Transaction) {
    return await School.findAll({ transaction });
  }
}

/**
 * Academic Year Service
 */
export class AcademicYearService {
  /**
   * Create academic year
   */
  static async create(data: any, transaction?: Transaction) {
    // Validate dates
    if (new Date(data.startDate) >= new Date(data.endDate)) {
      throw new ValidationError('End date must be after start date');
    }

    // If marking as current, unset other current years
    if (data.isCurrent) {
      await AcademicYear.update(
        { isCurrent: false },
        { where: { schoolId: data.schoolId }, transaction }
      );
    }

    return await AcademicYear.create(data, { transaction });
  }

  /**
   * Get academic year by ID
   */
  static async findById(id: number, transaction?: Transaction) {
    const academicYear = await AcademicYear.findByPk(id, {
      include: [
        {
          model: School,
          as: 'school',
          attributes: ['id', 'name', 'code'],
        },
      ],
      transaction,
    });

    if (!academicYear) {
      throw new NotFoundError('Academic year');
    }

    return academicYear;
  }

  /**
   * Update academic year
   */
  static async update(id: number, data: any, transaction?: Transaction) {
    const academicYear = await AcademicYear.findByPk(id, { transaction });

    if (!academicYear) {
      throw new NotFoundError('Academic year');
    }

    // Validate dates if provided
    if (data.startDate && data.endDate) {
      if (new Date(data.startDate) >= new Date(data.endDate)) {
        throw new ValidationError('End date must be after start date');
      }
    }

    // If marking as current, unset other current years
    if (data.isCurrent && !academicYear.isCurrent) {
      await AcademicYear.update(
        { isCurrent: false },
        { where: { schoolId: academicYear.schoolId, id: { [db.Sequelize.Op.ne]: id } }, transaction }
      );
    }

    await academicYear.update(data, { transaction });
    return await this.findById(id, transaction);
  }

  /**
   * Get current academic year for a school
   */
  static async getCurrent(schoolId: number, transaction?: Transaction) {
    const academicYear = await AcademicYear.findOne({
      where: { schoolId, isCurrent: true },
      transaction,
    });

    if (!academicYear) {
      throw new NotFoundError('Current academic year');
    }

    return academicYear;
  }
}

/**
 * Class Service
 */
export class ClassService {
  /**
   * Create class
   */
  static async create(data: any, transaction?: Transaction) {
    const existing = await Class.findOne({
      where: {
        schoolId: data.schoolId,
        name: data.name,
      },
      transaction,
    });

    if (existing) {
      throw new ConflictError('Class with this name already exists in this school');
    }

    return await Class.create(data, { transaction });
  }

  /**
   * Get class by ID
   */
  static async findById(id: number, transaction?: Transaction) {
    const classEntity = await Class.findByPk(id, {
      include: [
        {
          model: School,
          as: 'school',
          attributes: ['id', 'name', 'code'],
        },
        {
          model: Section,
          as: 'sections',
          attributes: ['id', 'name', 'capacity'],
        },
      ],
      transaction,
    });

    if (!classEntity) {
      throw new NotFoundError('Class');
    }

    return classEntity;
  }

  /**
   * Update class
   */
  static async update(id: number, data: any, transaction?: Transaction) {
    const classEntity = await Class.findByPk(id, { transaction });

    if (!classEntity) {
      throw new NotFoundError('Class');
    }

    await classEntity.update(data, { transaction });
    return await this.findById(id, transaction);
  }

  /**
   * Delete class
   */
  static async delete(id: number, transaction?: Transaction) {
    const classEntity = await Class.findByPk(id, { transaction });

    if (!classEntity) {
      throw new NotFoundError('Class');
    }

    await classEntity.destroy({ transaction });
  }
}

/**
 * Section Service
 */
export class SectionService {
  /**
   * Create section
   */
  static async create(data: any, transaction?: Transaction) {
    const existing = await Section.findOne({
      where: {
        classId: data.classId,
        name: data.name,
      },
      transaction,
    });

    if (existing) {
      throw new ConflictError('Section with this name already exists in this class');
    }

    return await Section.create(data, { transaction });
  }

  /**
   * Get section by ID
   */
  static async findById(id: number, transaction?: Transaction) {
    const section = await Section.findByPk(id, {
      include: [
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level'],
        },
      ],
      transaction,
    });

    if (!section) {
      throw new NotFoundError('Section');
    }

    return section;
  }

  /**
   * Update section
   */
  static async update(id: number, data: any, transaction?: Transaction) {
    const section = await Section.findByPk(id, { transaction });

    if (!section) {
      throw new NotFoundError('Section');
    }

    await section.update(data, { transaction });
    return await this.findById(id, transaction);
  }

  /**
   * Delete section
   */
  static async delete(id: number, transaction?: Transaction) {
    const section = await Section.findByPk(id, { transaction });

    if (!section) {
      throw new NotFoundError('Section');
    }

    await section.destroy({ transaction });
  }
}

/**
 * Subject Service
 */
export class SubjectService {
  /**
   * Create subject
   */
  static async create(data: any, transaction?: Transaction) {
    const existing = await Subject.findOne({
      where: {
        schoolId: data.schoolId,
        code: data.code,
      },
      transaction,
    });

    if (existing) {
      throw new ConflictError('Subject with this code already exists in this school');
    }

    return await Subject.create(data, { transaction });
  }

  /**
   * Get subject by ID
   */
  static async findById(id: number, transaction?: Transaction) {
    const subject = await Subject.findByPk(id, {
      include: [
        {
          model: School,
          as: 'school',
          attributes: ['id', 'name', 'code'],
        },
      ],
      transaction,
    });

    if (!subject) {
      throw new NotFoundError('Subject');
    }

    return subject;
  }

  /**
   * Update subject
   */
  static async update(id: number, data: any, transaction?: Transaction) {
    const subject = await Subject.findByPk(id, { transaction });

    if (!subject) {
      throw new NotFoundError('Subject');
    }

    await subject.update(data, { transaction });
    return await this.findById(id, transaction);
  }

  /**
   * Delete subject
   */
  static async delete(id: number, transaction?: Transaction) {
    const subject = await Subject.findByPk(id, { transaction });

    if (!subject) {
      throw new NotFoundError('Subject');
    }

    await subject.destroy({ transaction });
  }
}

/**
 * Teacher Service
 */
export class TeacherService {
  /**
   * Create teacher
   */
  static async create(data: any, transaction?: Transaction) {
    const existing = await Teacher.findOne({
      where: { userId: data.userId },
      transaction,
    });

    if (existing) {
      throw new ConflictError('Teacher record already exists for this user');
    }

    return await Teacher.create(data, { transaction });
  }

  /**
   * Get teacher by ID
   */
  static async findById(id: number, transaction?: Transaction) {
    const teacher = await Teacher.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
        {
          model: Subject,
          as: 'subjects',
          attributes: ['id', 'name', 'code'],
        },
      ],
      transaction,
    });

    if (!teacher) {
      throw new NotFoundError('Teacher');
    }

    return teacher;
  }

  /**
   * Update teacher
   */
  static async update(id: number, data: any, transaction?: Transaction) {
    const teacher = await Teacher.findByPk(id, { transaction });

    if (!teacher) {
      throw new NotFoundError('Teacher');
    }

    await teacher.update(data, { transaction });
    return await this.findById(id, transaction);
  }

  /**
   * Delete teacher
   */
  static async delete(id: number, transaction?: Transaction) {
    const teacher = await Teacher.findByPk(id, { transaction });

    if (!teacher) {
      throw new NotFoundError('Teacher');
    }

    await teacher.destroy({ transaction });
  }
}

/**
 * Student Service
 */
export class StudentService {
  /**
   * Create student
   */
  static async create(data: any, transaction?: Transaction) {
    const existing = await Student.findOne({
      where: {
        admissionNumber: data.admissionNumber,
        classId: data.classId,
      },
      transaction,
    });

    if (existing) {
      throw new ConflictError('Student with this admission number already exists in this class');
    }

    return await Student.create(data, { transaction });
  }

  /**
   * Get student by ID
   */
  static async findById(id: number, transaction?: Transaction) {
    const student = await Student.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level'],
        },
        {
          model: Section,
          as: 'section',
          attributes: ['id', 'name'],
        },
      ],
      transaction,
    });

    if (!student) {
      throw new NotFoundError('Student');
    }

    return student;
  }

  /**
   * Update student
   */
  static async update(id: number, data: any, transaction?: Transaction) {
    const student = await Student.findByPk(id, { transaction });

    if (!student) {
      throw new NotFoundError('Student');
    }

    await student.update(data, { transaction });
    return await this.findById(id, transaction);
  }

  /**
   * Delete student
   */
  static async delete(id: number, transaction?: Transaction) {
    const student = await Student.findByPk(id, { transaction });

    if (!student) {
      throw new NotFoundError('Student');
    }

    await student.destroy({ transaction });
  }
}

/**
 * Room Service
 */
export class RoomService {
  /**
   * Create room
   */
  static async create(data: any, transaction?: Transaction) {
    const existing = await Room.findOne({
      where: {
        schoolId: data.schoolId,
        name: data.name,
      },
      transaction,
    });

    if (existing) {
      throw new ConflictError('Room with this name already exists in this school');
    }

    return await Room.create(data, { transaction });
  }

  /**
   * Get room by ID
   */
  static async findById(id: number, transaction?: Transaction) {
    const room = await Room.findByPk(id, {
      include: [
        {
          model: School,
          as: 'school',
          attributes: ['id', 'name', 'code'],
        },
      ],
      transaction,
    });

    if (!room) {
      throw new NotFoundError('Room');
    }

    return room;
  }

  /**
   * Update room
   */
  static async update(id: number, data: any, transaction?: Transaction) {
    const room = await Room.findByPk(id, { transaction });

    if (!room) {
      throw new NotFoundError('Room');
    }

    await room.update(data, { transaction });
    return await this.findById(id, transaction);
  }

  /**
   * Delete room
   */
  static async delete(id: number, transaction?: Transaction) {
    const room = await Room.findByPk(id, { transaction });

    if (!room) {
      throw new NotFoundError('Room');
    }

    await room.destroy({ transaction });
  }
}
