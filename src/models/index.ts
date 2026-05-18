import { Sequelize } from 'sequelize-typescript'
import sequelize from '@/config/database.js'

// Core models
import { School } from './School.js'
import { User } from './User.js'
import { AcademicYear } from './AcademicYear.js'
import { Class } from './Class.js'
import { Section } from './Section.js'
import { Subject } from './Subject.js'
import { Teacher } from './Teacher.js'
import { Student } from './Student.js'
import { Parent } from './Parent.js'
import { Room } from './Room.js'

// Junction models
import { ClassSubject } from './ClassSubject.js'
import { SectionTeacher } from './SectionTeacher.js'
import { StudentParent } from './StudentParent.js'

// Timetable models
import { TimeSlot } from './TimeSlot.js'
import { Timetable } from './Timetable.js'
import { TimetableEntry } from './TimetableEntry.js'

// Exam models
import { Exam } from './Exam.js'
import { ExamSubject } from './ExamSubject.js'
import { StudentExam } from './StudentExam.js'

// Define all model associations
export function setupAssociations() {
  // School associations
  School.hasMany(User, { foreignKey: 'schoolId', as: 'users' })
  School.hasMany(AcademicYear, { foreignKey: 'schoolId', as: 'academicYears' })
  School.hasMany(Class, { foreignKey: 'schoolId', as: 'classes' })
  School.hasMany(Subject, { foreignKey: 'schoolId', as: 'subjects' })
  School.hasMany(Teacher, { foreignKey: 'schoolId', as: 'teachers' })
  School.hasMany(Student, { foreignKey: 'schoolId', as: 'students' })
  School.hasMany(Room, { foreignKey: 'schoolId', as: 'rooms' })
  School.hasMany(TimeSlot, { foreignKey: 'schoolId', as: 'timeSlots' })
  School.hasMany(Exam, { foreignKey: 'schoolId', as: 'exams' })

  // User associations
  User.belongsTo(School, { foreignKey: 'schoolId', as: 'school' })
  User.hasOne(Teacher, { foreignKey: 'userId', as: 'teacher' })
  User.hasOne(Student, { foreignKey: 'userId', as: 'student' })
  User.hasOne(Parent, { foreignKey: 'userId', as: 'parent' })

  // AcademicYear associations
  AcademicYear.belongsTo(School, { foreignKey: 'schoolId', as: 'school' })
  AcademicYear.hasMany(Class, { foreignKey: 'academicYearId', as: 'classes' })
  AcademicYear.hasMany(Exam, { foreignKey: 'academicYearId', as: 'exams' })
  AcademicYear.hasMany(Timetable, { foreignKey: 'academicYearId', as: 'timetables' })

  // Class associations
  Class.belongsTo(School, { foreignKey: 'schoolId', as: 'school' })
  Class.belongsTo(AcademicYear, { foreignKey: 'academicYearId', as: 'academicYear' })
  Class.hasMany(Section, { foreignKey: 'classId', as: 'sections' })
  Class.hasMany(ClassSubject, { foreignKey: 'classId', as: 'classSubjects' })
  Class.belongsToMany(Subject, { through: ClassSubject, foreignKey: 'classId', otherKey: 'subjectId', as: 'subjects' })
  Class.hasMany(Timetable, { foreignKey: 'classId', as: 'timetables' })
  Class.hasMany(Student, { foreignKey: 'classId', as: 'students' })

  // Section associations
  Section.belongsTo(Class, { foreignKey: 'classId', as: 'class' })
  Section.hasMany(SectionTeacher, { foreignKey: 'sectionId', as: 'sectionTeachers' })
  Section.hasMany(Timetable, { foreignKey: 'sectionId', as: 'timetables' })
  Section.hasMany(Student, { foreignKey: 'sectionId', as: 'students' })
  Section.belongsTo(Teacher, { foreignKey: 'classTeacherId', as: 'classTeacher' })

  // Subject associations
  Subject.belongsTo(School, { foreignKey: 'schoolId', as: 'school' })
  Subject.hasMany(ClassSubject, { foreignKey: 'subjectId', as: 'classSubjects' })
  Subject.hasMany(SectionTeacher, { foreignKey: 'subjectId', as: 'sectionTeachers' })
  Subject.hasMany(TimetableEntry, { foreignKey: 'subjectId', as: 'timetableEntries' })
  Subject.hasMany(ExamSubject, { foreignKey: 'subjectId', as: 'examSubjects' })

  // Teacher associations
  Teacher.belongsTo(User, { foreignKey: 'userId', as: 'user' })
  Teacher.belongsTo(School, { foreignKey: 'schoolId', as: 'school' })
  Teacher.hasMany(SectionTeacher, { foreignKey: 'teacherId', as: 'sectionTeachers' })
  Teacher.hasMany(TimetableEntry, { foreignKey: 'teacherId', as: 'timetableEntries' })
  Teacher.belongsToMany(Section, { through: SectionTeacher, foreignKey: 'teacherId', otherKey: 'sectionId', as: 'sections' })
  Teacher.belongsToMany(Subject, { through: SectionTeacher, foreignKey: 'teacherId', otherKey: 'subjectId', as: 'subjects' })

  // Student associations
  Student.belongsTo(User, { foreignKey: 'userId', as: 'user' })
  Student.belongsTo(School, { foreignKey: 'schoolId', as: 'school' })
  Student.belongsTo(Class, { foreignKey: 'classId', as: 'class' })
  Student.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' })
  Student.hasMany(StudentParent, { foreignKey: 'studentId', as: 'studentParents' })
  Student.hasMany(StudentExam, { foreignKey: 'studentId', as: 'studentExams' })
  Student.belongsToMany(Parent, { through: StudentParent, foreignKey: 'studentId', otherKey: 'parentId', as: 'parents' })

  // Parent associations
  Parent.belongsTo(User, { foreignKey: 'userId', as: 'user' })
  Parent.hasMany(StudentParent, { foreignKey: 'parentId', as: 'studentParents' })
  Parent.belongsToMany(Student, { through: StudentParent, foreignKey: 'parentId', otherKey: 'studentId', as: 'students' })

  // ClassSubject associations (junction table)
  ClassSubject.belongsTo(Class, { foreignKey: 'classId', as: 'class' })
  ClassSubject.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' })

  // SectionTeacher associations (junction table)
  SectionTeacher.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' })
  SectionTeacher.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' })
  SectionTeacher.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' })

  // StudentParent associations (junction table)
  StudentParent.belongsTo(Student, { foreignKey: 'studentId', as: 'student' })
  StudentParent.belongsTo(Parent, { foreignKey: 'parentId', as: 'parent' })

  // Room associations
  Room.belongsTo(School, { foreignKey: 'schoolId', as: 'school' })
  Room.hasMany(TimetableEntry, { foreignKey: 'roomId', as: 'timetableEntries' })
  Room.hasMany(ExamSubject, { foreignKey: 'roomId', as: 'examSubjects' })

  // TimeSlot associations
  TimeSlot.belongsTo(School, { foreignKey: 'schoolId', as: 'school' })

  // Timetable associations
  Timetable.belongsTo(Class, { foreignKey: 'classId', as: 'class' })
  Timetable.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' })
  Timetable.belongsTo(AcademicYear, { foreignKey: 'academicYearId', as: 'academicYear' })
  Timetable.hasMany(TimetableEntry, { foreignKey: 'timetableId', as: 'entries', onDelete: 'CASCADE' })

  // TimetableEntry associations
  TimetableEntry.belongsTo(Timetable, { foreignKey: 'timetableId', as: 'timetable' })
  TimetableEntry.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' })
  TimetableEntry.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' })
  TimetableEntry.belongsTo(Room, { foreignKey: 'roomId', as: 'room' })

  // Exam associations
  Exam.belongsTo(School, { foreignKey: 'schoolId', as: 'school' })
  Exam.belongsTo(AcademicYear, { foreignKey: 'academicYearId', as: 'academicYear' })
  Exam.hasMany(ExamSubject, { foreignKey: 'examId', as: 'examSubjects', onDelete: 'CASCADE' })
  Exam.belongsToMany(Subject, { through: ExamSubject, foreignKey: 'examId', otherKey: 'subjectId', as: 'subjects' })

  // ExamSubject associations
  ExamSubject.belongsTo(Exam, { foreignKey: 'examId', as: 'exam' })
  ExamSubject.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' })
  ExamSubject.belongsTo(Room, { foreignKey: 'roomId', as: 'room' })
  ExamSubject.hasMany(StudentExam, { foreignKey: 'examSubjectId', as: 'studentExams', onDelete: 'CASCADE' })

  // StudentExam associations
  StudentExam.belongsTo(Student, { foreignKey: 'studentId', as: 'student' })
  StudentExam.belongsTo(ExamSubject, { foreignKey: 'examSubjectId', as: 'examSubject' })
  StudentExam.belongsTo(Teacher, { foreignKey: 'evaluatedBy', as: 'evaluatedBy' })
}

// Load models into Sequelize
sequelize.addModels([
  School,
  User,
  AcademicYear,
  Class,
  Section,
  Subject,
  Teacher,
  Student,
  Parent,
  Room,
  ClassSubject,
  SectionTeacher,
  StudentParent,
  TimeSlot,
  Timetable,
  TimetableEntry,
  Exam,
  ExamSubject,
  StudentExam,
])

// Setup associations
setupAssociations()

// Export all models
export {
  School,
  User,
  AcademicYear,
  Class,
  Section,
  Subject,
  Teacher,
  Student,
  Parent,
  Room,
  ClassSubject,
  SectionTeacher,
  StudentParent,
  TimeSlot,
  Timetable,
  TimetableEntry,
  Exam,
  ExamSubject,
  StudentExam,
}
