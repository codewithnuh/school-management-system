import express from 'express'
import { ExamSubjectController } from '@/controllers/ExamSubjectController.js'

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: Exam Subjects
 *     description: Endpoints for assigning and managing subjects for exams.
 */

/**
 * @openapi
 * /exams/{examId}/subjects:
 *   post:
 *     tags: [Exam Subjects]
 *     summary: Assign subjects to an exam
 *     description: Assigns one or more subjects to the specified exam, including max and pass marks.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: The exam identifier.
 *         schema:
 *           type: string
 *           example: "123"
 *     requestBody:
 *       description: Payload containing an array of subject details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     maxMarks:
 *                       type: number
 *                       example: 100
 *                     passMarks:
 *                       type: number
 *                       example: 40
 *             required:
 *               - subjects
 *     responses:
 *       201:
 *         description: Subjects assigned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ExamSubject'
 *       400:
 *         description: Invalid input parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error while assigning subjects.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:examId/subjects', ExamSubjectController.assignSubjectsToExam)

/**
 * @openapi
 * /exams/{examId}/subjects:
 *   get:
 *     tags: [Exam Subjects]
 *     summary: Fetch all subjects assigned to an exam
 *     description: Retrieves the list of subjects assigned to the specified exam.
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: The exam identifier.
 *         schema:
 *           type: string
 *           example: "123"
 *     responses:
 *       200:
 *         description: List of assigned subjects retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ExamSubject'
 *       404:
 *         description: Exam not found or no subjects assigned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error while fetching subjects.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:examId/subjects', ExamSubjectController.getSubjectsForExam)

/**
 * @openapi
 * /exams/{examId}/subjects/{subjectId}:
 *   delete:
 *     tags: [Exam Subjects]
 *     summary: Remove a subject from an exam
 *     description: Removes the specified subject from the exam.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: The exam identifier.
 *         schema:
 *           type: string
 *           example: "123"
 *       - in: path
 *         name: subjectId
 *         required: true
 *         description: The identifier of the subject to remove.
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Subject removed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Exam not found or subject not assigned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error while removing the subject.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
    '/:examId/subjects/:subjectId',
    ExamSubjectController.removeSubjectFromExam,
)

export default router
