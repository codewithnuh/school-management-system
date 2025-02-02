/**
 * @openapi
 * /timetable/generate/{classid}:
 *   post:
 *     tags:
 *       - Timetable
 *     summary: Generate a new timetable for a class
 *     description: Generates and saves a new timetable schedule for the specified class ID
 *     parameters:
 *       - in: path
 *         name: classid
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the class to generate timetable for
 *     responses:
 *       200:
 *         description: Timetable generated successfully
 *       400:
 *         description: Invalid input parameters
 *       500:
 *         description: Server error while generating timetable
 */

/**
 * @openapi
 * /timetable/{classId}/{sectionId}:
 *   get:
 *     tags:
 *       - Timetable
 *     summary: Get timetable for a class section
 *     description: Retrieves the timetable schedule for the specified class and section
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the class
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the section
 *     responses:
 *       200:
 *         description: Returns the timetable data
 *       404:
 *         description: Timetable not found
 *       500:
 *         description: Server error while fetching timetable
 */

/**
 * @openapi
 * /timetable/teacher/{teacherId}:
 *   get:
 *     tags:
 *       - Timetable
 *     summary: Get timetable for a teacher
 *     description: Retrieves the timetable schedule for the specified teacher
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the teacher
 *     responses:
 *       200:
 *         description: Returns the teacher's timetable data
 *       404:
 *         description: Timetable not found
 *       500:
 *         description: Server error while fetching timetable
 */

/**
 * @openapi
 * /timetable/weekly/{classId}/{sectionId}:
 *   get:
 *     tags:
 *       - Timetable
 *     summary: Get weekly timetable for a class section
 *     description: Retrieves the weekly timetable schedule for the specified class and section
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the class
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the section
 *     responses:
 *       200:
 *         description: Returns the weekly timetable data
 *       404:
 *         description: Timetable not found
 *       500:
 *         description: Server error while fetching timetable
 */

/**
 * @openapi
 * /timetable/weekly/{classId}/teacher/{teacherId}:
 *   get:
 *     tags:
 *       - Timetable
 *     summary: Get weekly timetable for a teacher in a class
 *     description: Retrieves the weekly timetable schedule for the specified teacher in a class
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the class
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the teacher
 *     responses:
 *       200:
 *         description: Returns the weekly timetable data
 *       404:
 *         description: Timetable not found
 *       500:
 *         description: Server error while fetching timetable
 */

import express from 'express'
import { TimetableController } from '@/controllers/TimeTableController'

const router = express.Router()

router.post('/generate/:classid', TimetableController.generateTimetable)
router.get('/teacher/:teacherId', TimetableController.getTeacherTimetable)
router.get('/:classId/:sectionId', TimetableController.getTimetable)
router.get(
    '/weekly/:classId/:sectionId',
    TimetableController.getWeeklyTimetable,
)
router.get(
    '/weekly/:classId/teacher/:teacherId',
    TimetableController.getWeeklyTimetable,
)
export default router
