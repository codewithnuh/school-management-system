// subject.routes.ts
import { Router } from 'express'
import { SubjectController } from '@/controllers/SubjectController.js'

const router = Router()

/**
 * @route   POST /api/v1/subjects
 * @desc    Create a new subject
 * @access  Private (Admin or authorized user)
 */
router.post('/', SubjectController.create)

/**
 * @route   GET /api/v1/subjects/:id
 * @desc    Get a subject by ID
 * @access  Public or Private (depending on your requirements)
 */
router.get('/:id', SubjectController.getById)

/**
 * @route   GET /api/v1/subjects
 * @desc    Get all subjects
 * @access  Public or Private (depending on your requirements)
 */
router.get('/', SubjectController.getAll)

/**
 * @route   PUT /api/v1/subjects/:id
 * @desc    Update a subject by ID
 * @access  Private (Admin or authorized user)
 */
router.put('/:id', SubjectController.update)

/**
 * @route   DELETE /api/v1/subjects/:id
 * @desc    Delete a subject by ID
 * @access  Private (Admin or authorized user)
 */
router.delete('/:id', SubjectController.delete)

export default router
