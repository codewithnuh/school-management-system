import { Router } from 'express'
import { ExamController } from '@/controllers/ExamController.js'
import authWithRBAC from '@/middleware/auth.middleware.js'

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     ExamInput:
 *       type: object
 *       required: [academicYearId, name, type, startDate, endDate]
 *       properties:
 *         academicYearId: { type: integer, minimum: 1 }
 *         name: { type: string, minLength: 1, maxLength: 120 }
 *         type:
 *           type: string
 *           enum: [UNIT_TEST, HALF_YEARLY, ANNUAL, QUARTERLY, OTHER]
 *         startDate: { type: string, format: date-time }
 *         endDate: { type: string, format: date-time }
 *         isActive: { type: boolean, default: true }
 *     Exam:
 *       allOf:
 *         - $ref: '#/components/schemas/ExamInput'
 *         - type: object
 *           required: [id, schoolId, createdAt, updatedAt]
 *           properties:
 *             id: { type: integer }
 *             schoolId: { type: integer }
 *             createdAt: { type: string, format: date-time }
 *             updatedAt: { type: string, format: date-time }
 *     ExamResponse:
 *       type: object
 *       required: [success, data, error, message, statusCode, timestamp]
 *       properties:
 *         success: { type: boolean }
 *         data: { $ref: '#/components/schemas/Exam' }
 *         error: { type: string, nullable: true }
 *         message: { type: string, nullable: true }
 *         statusCode: { type: integer }
 *         timestamp: { type: string, format: date-time }
 *     ExamListResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean }
 *         data:
 *           type: array
 *           items: { $ref: '#/components/schemas/Exam' }
 *         error: { type: string, nullable: true }
 *         message: { type: string, nullable: true }
 *         statusCode: { type: integer }
 *         timestamp: { type: string, format: date-time }
 */

/**
 * @openapi
 * /exams:
 *   post:
 *     summary: Create an exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ExamInput' }
 *     responses:
 *       201:
 *         description: Exam created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ExamResponse' }
 *       400: { description: Invalid input }
 *       401: { description: Authentication required }
 *       403: { description: Role is not allowed }
 */
router.post('/', authWithRBAC(['ADMIN']), ExamController.createExam)

/**
 * @openapi
 * /exams:
 *   get:
 *     summary: List exams
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Exams
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ExamListResponse' }
 *       401: { description: Authentication required }
 */
router.get('/', authWithRBAC(['ADMIN', 'TEACHER']), ExamController.getAllExams)

/**
 * @openapi
 * /exams/{id}:
 *   get:
 *     summary: Get an exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Exam
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ExamResponse' }
 *       400: { description: Invalid exam ID }
 *       404: { description: Exam not found }
 */
router.get('/:id', authWithRBAC(['ADMIN', 'TEACHER']), ExamController.getExamById)

/**
 * @openapi
 * /exams/{id}:
 *   put:
 *     summary: Update an exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ExamInput'
 *               - type: object
 *                 properties:
 *                   schoolId:
 *                     type: integer
 *                     readOnly: true
 *     responses:
 *       200:
 *         description: Exam updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ExamResponse' }
 *       400: { description: Invalid input or exam ID }
 *       404: { description: Exam not found }
 */
router.put('/:id', authWithRBAC(['ADMIN']), ExamController.updateExam)

/**
 * @openapi
 * /exams/{id}:
 *   delete:
 *     summary: Delete an exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       204: { description: Exam deleted }
 *       400: { description: Invalid exam ID }
 *       404: { description: Exam not found }
 */
router.delete('/:id', authWithRBAC(['ADMIN']), ExamController.deleteExam)

export default router
