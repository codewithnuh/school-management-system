import express from 'express'
import { ResultController } from '@/controllers/ResultController.js'

const router = express.Router()

/**
 * @route   POST /results
 * @desc    Record marks for a student in an exam subject
 * @access  Private (Teacher)
 */
router.post('/', ResultController.recordMarks)

/**
 * @route   GET /results/students/:studentId
 * @desc    Fetch results for a specific student
 * @access  Private (Student/Teacher/Admin)
 */
router.get('/students/:studentId', ResultController.getResultsForStudent)

/**
 * @route   GET /results/exams/:examId
 * @desc    Fetch results for a specific exam
 * @access  Private (Teacher/Admin)
 */
router.get('/exams/:examId', ResultController.getResultsForExam)

/**
 * @route   POST /results/calculate-grade
 * @desc    Calculate grade based on marks obtained
 * @access  Private (Teacher/Admin)
 */
router.post('/calculate-grade', ResultController.calculateGrade)

export default router
