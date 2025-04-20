import express from 'express'
import { TimetableController } from '@/controllers/TimeTableController.js'
import authWithRBAC from '@/middleware/auth.middleware.js'

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: Timetable
 *     description: API endpoints for managing timetables.
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
 *     TimetableInput:
 *       type: object
 *       properties:
 *         classId:
 *           type: string
 *           example: "101"
 *           description: The ID of the class.
 *         sectionId:
 *           type: string
 *           example: "1"
 *           description: The ID of the section.
 *         day:
 *           type: string
 *           enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *           description: The day of the week.
 *         periodNumber:
 *           type: integer
 *           description: The period number within the day.
 *           example: 1
 *         subjectId:
 *           type: string
 *           example: "MATH101"
 *           description: The ID of the subject.
 *         teacherId:
 *           type: string
 *           example: "T123"
 *           description: The ID of the teacher.
 *       required:
 *         - classId
 *         - sectionId
 *         - day
 *         - periodNumber
 *         - subjectId
 *         - teacherId
 *     TimetableResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           description: The timetable data (structure may vary).
 *         message:
 *           type: string
 *           example: "Timetable generated successfully"
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
 * /timetable/generate/{classid}:
 *   post:
 *     tags: [Timetable]
 *     summary: Generate a new timetable for a class
 *     description: Generates and saves a new timetable schedule for the specified class ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classid
 *         required: true
 *         description: The ID of the class to generate the timetable for.
 *         schema:
 *           type: string
 *           example: "101"
 *     responses:
 *       200:
 *         description: Timetable generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimetableResponse'
 *       400:
 *         description: Invalid input parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error while generating timetable.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    '/generate/:classid',
    authWithRBAC(['ADMIN']),
    TimetableController.generateTimetable,
)

/**
 * @openapi
 * /timetable/weekly/{classId}/{sectionId}:
 *   get:
 *     tags: [Timetable]
 *     summary: Get weekly timetable for a class section
 *     description: Retrieves the weekly timetable schedule for the specified class and section.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         description: The ID of the class.
 *         schema:
 *           type: string
 *           example: "101"
 *       - in: path
 *         name: sectionId
 *         required: true
 *         description: The ID of the section.
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Returns the weekly timetable data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimetableResponse'
 *       404:
 *         description: Timetable not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error while fetching timetable.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
    '/weekly/:classId/:sectionId',
    authWithRBAC(['ADMIN','USER']),
    TimetableController.getWeeklyTimetable,
)

router.get(
    '/teacher/:teacherId',
    authWithRBAC(['ADMIN', 'TEACHER']),
    TimetableController.getTeacherTimetable,
)

export default router
