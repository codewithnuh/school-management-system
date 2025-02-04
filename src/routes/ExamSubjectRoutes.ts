import express from 'express'
import { ExamSubjectController } from '@/controllers/ExamSubjectController.js'

const router = express.Router()

/**
 * @route   POST /exams/:examId/subjects
 * @desc    Assign subjects to an exam
 * @access  Private (Admin/Teacher)
 */
router.post('/:examId/subjects', ExamSubjectController.assignSubjectsToExam)

/**
 * @route   GET /exams/:examId/subjects
 * @desc    Fetch all subjects assigned to an exam
 * @access  Public/Private (Admin/Teacher)
 */
router.get('/:examId/subjects', ExamSubjectController.getSubjectsForExam)

/**
 * @route   DELETE /exams/:examId/subjects/:subjectId
 * @desc    Remove a subject from an exam
 * @access  Private (Admin/Teacher)
 */
router.delete(
    '/:examId/subjects/:subjectId',
    ExamSubjectController.removeSubjectFromExam,
)

export default router
