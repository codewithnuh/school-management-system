import express from 'express'
import { TimetableController } from '@/controllers/TimeTableController.js'

const router = express.Router()

/**
 * @openapi
 * /timetable/generate/{classid}:
 *   post:
 *     tags: [Timetable]
 *     summary: Generate a new timetable for a class
 *     description: Generates and saves a new timetable schedule for the specified class ID.
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Generated timetable details.
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
router.post('/generate/:classid', TimetableController.generateTimetable)

/**
 * @openapi
 * /timetable/{classId}/{sectionId}:
 *   get:
 *     tags: [Timetable]
 *     summary: Get timetable for a class section
 *     description: Retrieves the timetable schedule for the specified class and section.
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
 *         description: Returns the timetable data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Timetable details.
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
router.get('/:classId/:sectionId', TimetableController.getTimetable)

/**
 * @openapi
 * /timetable/teacher/{teacherId}:
 *   get:
 *     tags: [Timetable]
 *     summary: Get timetable for a teacher
 *     description: Retrieves the timetable schedule for the specified teacher.
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         description: The ID of the teacher.
 *         schema:
 *           type: string
 *           example: "202"
 *     responses:
 *       200:
 *         description: Returns the teacher's timetable data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Teacher timetable details.
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
router.get('/teacher/:teacherId', TimetableController.getTeacherTimetable)

/**
 * @openapi
 * /timetable/weekly/{classId}/{sectionId}:
 *   get:
 *     tags: [Timetable]
 *     summary: Get weekly timetable for a class section
 *     description: Retrieves the weekly timetable schedule for the specified class and section.
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Weekly timetable details.
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
    TimetableController.getWeeklyTimetable,
)

/**
 * @openapi
 * /timetable/weekly/{classId}/teacher/{teacherId}:
 *   get:
 *     tags: [Timetable]
 *     summary: Get weekly timetable for a teacher in a class
 *     description: Retrieves the weekly timetable schedule for the specified teacher in a class.
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         description: The ID of the class.
 *         schema:
 *           type: string
 *           example: "101"
 *       - in: path
 *         name: teacherId
 *         required: true
 *         description: The ID of the teacher.
 *         schema:
 *           type: string
 *           example: "202"
 *     responses:
 *       200:
 *         description: Returns the weekly timetable data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Weekly timetable details.
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
    '/weekly/:classId/teacher/:teacherId',
    TimetableController.getWeeklyTimetable,
)

export default router
