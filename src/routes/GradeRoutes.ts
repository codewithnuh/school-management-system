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

/* --------------------------------------------------------------------------
   Swagger/OpenAPI Documentation

   The documentation below provides complete details for each grade route.
   Use this section as a guide for adding new endpoints. Endpoints include
   detailed descriptions, parameters, request bodies, example payloads,
   responses, and error responses adhering to OpenAPI 3.0 standards.
---------------------------------------------------------------------------
*/

/**
 * @swagger
 * tags:
 *   - name: Grades
 *     description: API endpoints for managing grade criteria.
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Grade:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         grade:
 *           type: string
 *           example: "A+"
 *         minMarks:
 *           type: number
 *           example: 90
 *         maxMarks:
 *           type: number
 *           example: 100
 *       required:
 *         - grade
 *         - minMarks
 *         - maxMarks
 *     GradeInput:
 *       type: object
 *       properties:
 *         grade:
 *           type: string
 *           example: "A"
 *         minMarks:
 *           type: number
 *           example: 80
 *         maxMarks:
 *           type: number
 *           example: 89
 *       required:
 *         - grade
 *         - minMarks
 *         - maxMarks
 *     GradeResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Grade'
 *         message:
 *           type: string
 *           example: "Grade added successfully"
 *     GradesListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Grade'
 *         message:
 *           type: string
 *           example: "Grades retrieved successfully"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "An error occurred"
 */

/**
 * @swagger
 * /grades:
 *   post:
 *     summary: Add a new grade criterion
 *     tags:
 *       - Grades
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Grade information for creating a new criterion
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradeInput'
 *           examples:
 *             newGrade:
 *               summary: New grade criterion example
 *               value:
 *                 grade: "A"
 *                 minMarks: 80
 *                 maxMarks: 89
 *     responses:
 *       201:
 *         description: Grade added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GradeResponse'
 *       400:
 *         description: Invalid input or error adding grade.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /grades:
 *   get:
 *     summary: Fetch all grade criteria
 *     tags:
 *       - Grades
 *     responses:
 *       200:
 *         description: Grades retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GradesListResponse'
 *       400:
 *         description: Error retrieving grades.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /grades/{id}:
 *   put:
 *     summary: Update a grade criterion
 *     tags:
 *       - Grades
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Numeric ID of the grade to update
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       description: Updated grade data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradeInput'
 *           examples:
 *             updateGrade:
 *               summary: Update grade criterion example
 *               value:
 *                 grade: "A+"
 *                 minMarks: 90
 *                 maxMarks: 100
 *     responses:
 *       200:
 *         description: Grade updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 *       400:
 *         description: Invalid grade ID or input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Grade not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /grades/{id}:
 *   delete:
 *     summary: Delete a grade criterion
 *     tags:
 *       - Grades
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Numeric ID of the grade to delete
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       204:
 *         description: Grade deleted successfully. No content returned.
 *       400:
 *         description: Invalid grade ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Grade not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
