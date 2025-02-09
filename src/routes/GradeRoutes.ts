import express from 'express'
import { GradeController } from '@/controllers/GradeController.js'

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: Grades
 *     description: API endpoints for managing grade criteria.
 */

/**
 * @openapi
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
 *         gradeId:
 *           type: number
 *           example: 1
 *         gradeName:
 *           type: string
 *           example: "A+"
 *         lowerPercentage:
 *           type: number
 *           example: 90
 *         upperPercentage:
 *           type: number
 *           example: 100
 *         description:
 *           type: string
 *           example: "Excellent"
 *       required:
 *         - gradeName
 *         - lowerPercentage
 *         - upperPercentage
 *     GradeInput:
 *       type: object
 *       properties:
 *         gradeName:
 *           type: string
 *           example: "A"
 *         lowerPercentage:
 *           type: number
 *           example: 80
 *         upperPercentage:
 *           type: number
 *           example: 89
 *         description:
 *           type: string
 *           example: "Very Good"
 *       required:
 *         - gradeName
 *         - lowerPercentage
 *         - upperPercentage
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
 * @openapi
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
 *                 gradeName: "A"
 *                 lowerPercentage: 80
 *                 upperPercentage: 89
 *                 description: "Very Good"
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
router.post('/', GradeController.addGrade)

/**
 * @openapi
 * /grades:
 *   get:
 *     summary: Fetch all grade criteria
 *     tags:
 *       - Grades
 *     security:
 *       - bearerAuth: []
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
router.get('/', GradeController.getAllGrades)

/**
 * @openapi
 * /grades/{gradeId}:
 *   put:
 *     summary: Update a grade criterion
 *     tags:
 *       - Grades
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gradeId
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
 *                 gradeName: "A+"
 *                 lowerPercentage: 90
 *                 upperPercentage: 100
 *                 description: "Excellent"
 *     responses:
 *       200:
 *         description: Grade updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GradeResponse'
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
router.put('/:id', GradeController.updateGrade)

/**
 * @openapi
 * /grades/{gradeId}:
 *   delete:
 *     summary: Delete a grade criterion
 *     tags:
 *       - Grades
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gradeId
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
router.delete('/:id', GradeController.deleteGrade)

export default router
