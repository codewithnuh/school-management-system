import express from 'express'
import TeacherController from '@/controllers/TeacherController.js'
import authenticate from '@/middleware/auth.middleware.js'

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: Teachers
 *     description: Teacher management endpoints
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
 *     Teacher:
 *       type: object
 *       properties:
 *         teacherId:
 *           type: string
 *           example: "1"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         subject:
 *           type: string
 *           example: "Mathematics"
 *         qualifications:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Bachelors", "Masters"]
 *         status:
 *           type: string
 *           enum:
 *             - active
 *             - pending
 *             - rejected
 *           description: The current status of the teacher's application.
 *           example: "pending"
 *       required:
 *         - name
 *         - email
 *         - subject
 *         - qualifications
 *     TeacherResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Teacher'
 *         message:
 *           type: string
 *           example: "Teacher retrieved successfully"
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
 * /teachers:
 *   get:
 *     summary: Get all teachers
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - active
 *             - pending
 *             - rejected
 *         description: Filter teachers by status
 *     responses:
 *       200:
 *         description: List of teachers retrieved successfully
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
 *                     $ref: '#/components/schemas/Teacher'
 *                 message:
 *                   type: string
 *                   example: "Teachers retrieved successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authenticate(['ADMIN']), TeacherController.getTeachers)

/**
 * @openapi
 * /teachers/{id}:
 *   get:
 *     summary: Get teacher by ID
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Teacher ID
 *         schema:
 *           type: string
 *         example: "1"
 *     responses:
 *       200:
 *         description: Teacher details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeacherResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Teacher not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', TeacherController.getTeacherById)

/**
 * @openapi
 * /teachers/register:
 *   post:
 *     summary: Register a new teacher
 *     tags: [Teachers]
 *     requestBody:
 *       description: Teacher registration data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       201:
 *         description: Teacher registration submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeacherResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', TeacherController.registerTeacher)
router.post(
    '/accept-teacher-application',
    authenticate(['ADMIN']),
    TeacherController.acceptTeacherApplication,
)
router.post(
    '/reject-teacher-application',
    authenticate(['ADMIN']),
    TeacherController.rejectTeacherApplication,
)
/**
 * @openapi
 * /teachers/interview:
 *   post:
 *     summary: Schedule an interview for a teacher applicant
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Data to schedule an interview.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *               - interviewDate
 *             properties:
 *               teacherId:
 *                 type: string
 *                 example: "1"
 *               interviewDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-08-25T10:00:00Z"
 *               notes:
 *                 type: string
 *                 example: "Pre-interview call scheduled"
 *     responses:
 *       200:
 *         description: Interview scheduled successfully
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
 *                   example: "Interview scheduled successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Teacher not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    '/interview',
    authenticate(['ADMIN']),

    TeacherController.interviewTeacherApplicant,
)

export default router
