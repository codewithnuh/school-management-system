import express from 'express'
import { ClassController } from '@/controllers/ClassController.js'

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: Classes
 *     description: API endpoints for managing classes.
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated ID of the class
 *           readOnly: true
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of the class
 *           example: "Grade 10"
 *         description:
 *           type: string
 *           description: A brief description of the class
 *           example: "Class for 10th grade students"
 *         maxStudents:
 *           type: number
 *           description: Maximum number of students allowed in the class
 *           example: 40
 *         periodsPerDay:
 *           type: number
 *           description: Number of periods scheduled per day for this class
 *           example: 8
 *         periodLength:
 *           type: number
 *           description: Length of each period in minutes
 *           example: 45
 *         workingDays:
 *           type: array
 *           description: Days of the week when the class operates
 *           items:
 *             type: string
 *             enum:
 *               - Monday
 *               - Tuesday
 *               - Wednesday
 *               - Thursday
 *               - Friday
 *               - Saturday
 *               - Sunday
 *           example: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
 *         subjectIds:
 *           type: array
 *           description: List of subject IDs associated with this class
 *           items:
 *             type: number
 *           example: [1, 2, 3]
 *         sections:
 *           type: array
 *           description: List of sections within this class
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the section
 *                 example: "Section A"
 *               maxStudents:
 *                 type: number
 *                 description: Maximum students allowed in this section
 *                 example: 20
 *               classTeacherId:
 *                 type: number
 *                 description: ID of the teacher assigned to this section
 *                 example: 10
 *               subjectTeachers:
 *                 type: object
 *                 description: Mapping of subject IDs to teacher IDs for this section
 *                 additionalProperties:
 *                   type: number
 *                 example: {"1": 12, "2": 15}
 *             required:
 *               - name
 *               - maxStudents
 *               - classTeacherId
 *               - subjectTeachers
 *       required:
 *         - name
 *         - maxStudents
 *         - periodsPerDay
 *         - periodLength
 *         - workingDays
 *         - subjectIds
 *         - sections
 *     ClassResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Class'
 *         message:
 *           type: string
 *           example: "Class created successfully"
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
 * /api/v1/classes:
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Class creation payload
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Class'
 *     responses:
 *       201:
 *         description: Class created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', ClassController.createClass)

/**
 * @openapi
 * /api/v1/classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all classes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Class'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', ClassController.getAllClasses)

/**
 * @openapi
 * /api/v1/classes/{id}:
 *   get:
 *     summary: Get a class by ID
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier for the class
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassResponse'
 *       404:
 *         description: Class not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', ClassController.getClassById)

/**
 * @openapi
 * /api/v1/classes/{id}:
 *   put:
 *     summary: Update a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the class to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated class data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Class'
 *     responses:
 *       200:
 *         description: Class updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassResponse'
 *       404:
 *         description: Class not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', ClassController.updateClass)

/**
 * @openapi
 * /api/v1/classes/{id}:
 *   delete:
 *     summary: Delete a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the class to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Class deleted successfully"
 *       404:
 *         description: Class not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', ClassController.deleteClass)

export default router
