import express from 'express'
import { ExamController } from '@/controllers/ExamController'

const router = express.Router()

/**
 * @route   POST /exams
 * @desc    Create a new exam
 * @access  Private (Admin/Teacher)
 */
router.post('/', ExamController.createExam)

/**
 * @route   GET /exams
 * @desc    Fetch all exams
 * @access  Public/Private (Admin/Teacher)
 */
router.get('/', ExamController.getAllExams)

/**
 * @route   GET /exams/:id
 * @desc    Fetch an exam by ID
 * @access  Public/Private (Admin/Teacher)
 */
router.get('/:id', ExamController.getExamById)

/**
 * @route   PUT /exams/:id
 * @desc    Update an exam
 * @access  Private (Admin/Teacher)
 */
router.put('/:id', ExamController.updateExam)

/**
 * @route   DELETE /exams/:id
 * @desc    Delete an exam
 * @access  Private (Admin/Teacher)
 */
router.delete('/:id', ExamController.deleteExam)

export default router
