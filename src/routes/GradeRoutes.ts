import express from 'express'
import { GradeController } from '@/controllers/GradeController.js'

const router = express.Router()

/**
 * @route   POST /grades
 * @desc    Add a new grade criterion
 * @access  Private (Admin)
 */
router.post('/', GradeController.addGrade)

/**
 * @route   GET /grades
 * @desc    Fetch all grade criteria
 * @access  Public/Private (Admin/Teacher)
 */
router.get('/', GradeController.getAllGrades)

/**
 * @route   PUT /grades/:id
 * @desc    Update a grade criterion
 * @access  Private (Admin)
 */
router.put('/:id', GradeController.updateGrade)

/**
 * @route   DELETE /grades/:id
 * @desc    Delete a grade criterion
 * @access  Private (Admin)
 */
router.delete('/:id', GradeController.deleteGrade)

export default router
