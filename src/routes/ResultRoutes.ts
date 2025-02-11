import express from 'express'
import { ResultController } from '@/controllers/ResultController.js'

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: Results
 *     description: API endpoints for managing exam results.
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
 *     ResultInput:
 *       type: object
 *       properties:
 *         studentId:
 *           type: integer
 *           description: ID of the student.
 *           example: 1
 *         examId:
 *           type: integer
 *           description: ID of the exam.
 *           example: 10
 *         subjectId:
 *           type: integer
 *           description: ID of the subject.
 *           example: 5
 *         marksObtained:
 *           type: number
 *           description: Marks obtained by the student.
 *           example: 85.5
 *       required:
 *         - studentId
 *         - examId
 *         - subjectId
 *         - marksObtained
 *     ResultResponse:
 *       type: object
 *       properties:
 *         resultId:
 *           type: integer
 *           description: ID of the result.
 *           example: 1
 *         studentId:
 *           type: integer
 *           description: ID of the student.
 *           example: 1
 *         examId:
 *           type: integer
 *           description: ID of the exam.
 *           example: 10
 *         subjectId:
 *           type: integer
 *           description: ID of the subject.
 *           example: 5
 *         marksObtained:
 *           type: number
 *           description: Marks obtained by the student.
 *           example: 85.5
 *       required:
 *         - studentId
 *         - examId
 *         - subjectId
 *         - marksObtained
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           default: false
 *         message:
 *           type: string
 *           example: "An error occurred"
 */

/**
 * @openapi
 * /results:
 *   post:
 *     tags:
 *       - Results
 *     summary: Create a new exam result
 *     description: Creates a new exam result in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResultInput'
 *           examples:
 *             resultInput:
 *               summary: Exam Result Input Example
 *               value:
 *                 studentId: 1
 *                 examId: 10
 *                 subjectId: 5
 *                 marksObtained: 85.5
 *     responses:
 *       201:
 *         description: Result created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResultResponse'
 *       400:
 *         description: Bad request - invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', ResultController.createResult)

/**
 * @openapi
 * /results:
 *   get:
 *     tags:
 *       - Results
 *     summary: Get all exam results
 *     description: Retrieves a list of all exam results in the system.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation - returns list of results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ResultResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', ResultController.getAllResults)

/**
 * @openapi
 * /results/{resultId}:
 *   get:
 *     tags:
 *       - Results
 *     summary: Get result by ID
 *     description: Retrieves a specific exam result by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resultId
 *         required: true
 *         description: ID of the result to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful operation - returns the result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResultResponse'
 *       400:
 *         description: Bad request - invalid result ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Result not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/results/:id', ResultController.getResultById)

/**
 * @openapi
 * /results/student/{studentId}:
 *   get:
 *     tags:
 *       - Results
 *     summary: Get results by student ID
 *     description: Retrieves all exam results for a specific student.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: ID of the student to retrieve results for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful operation - returns list of results for the student
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ResultResponse'
 *       400:
 *         description: Bad request - invalid student ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
    '/results/student/:studentId',
    ResultController.getResultsByStudentId,
)

/**
 * @openapi
 * /results/exam/{examId}:
 *   get:
 *     tags:
 *       - Results
 *     summary: Get results by exam ID
 *     description: Retrieves all exam results for a specific exam.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: ID of the exam to retrieve results for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful operation - returns list of results for the exam
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ResultResponse'
 *       400:
 *         description: Bad request - invalid exam ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/results/exam/:examId', ResultController.getResultsByExamId)

/**
 * @openapi
 * /results/{resultId}:
 *   put:
 *     tags:
 *       - Results
 *     summary: Update an existing exam result
 *     description: Updates an existing exam result using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resultId
 *         required: true
 *         description: ID of the result to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResultInput'
 *           examples:
 *             resultInput:
 *               summary: Exam Result Input Example
 *               value:
 *                 studentId: 1
 *                 examId: 10
 *                 subjectId: 5
 *                 marksObtained: 90
 *     responses:
 *       200:
 *         description: Result updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResultResponse'
 *       400:
 *         description: Bad request - invalid input or result ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Result not found for update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/results/:id', ResultController.updateResult)

/**
 * @openapi
 * /results/{resultId}:
 *   delete:
 *     tags:
 *       - Results
 *     summary: Delete an exam result by ID
 *     description: Deletes an exam result from the system.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resultId
 *         required: true
 *         description: ID of the result to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Result deleted successfully - No content
 *       400:
 *         description: Bad request - invalid result ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Result not found for deletion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/results/:id', ResultController.deleteResult)

export default router
