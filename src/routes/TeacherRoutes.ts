import express from 'express'
import TeacherController from '@/controllers/TeacherController.js'

const router = express.Router()

/**
 * @swagger
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
 *           enum: [active, pending, rejected]
 *         description: Filter teachers by status
 *     responses:
 *       200:
 *         description: List of teachers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   subject:
 *                     type: string
 *                   status:
 *                     type: string
 *                   qualifications:
 *                     type: array
 *                     items:
 *                       type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/', TeacherController.getTeachers)
/**
 * @swagger
 * /teachers/register:
 *   post:
 *     summary: Register a new teacher
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - qualifications
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               subject:
 *                 type: string
 *               qualifications:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Teacher registration submitted successfully
 *       400:
 *         description: Invalid input
 */
router.post('/register', TeacherController.registerTeacher)
/**
 * @swagger
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
 *         schema:
 *           type: string
 *         description: Teacher ID
 *     responses:
 *       200:
 *         description: Teacher details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 subject:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Teacher not found
 */
router.get('/:id', TeacherController.getTeacherById.bind)
/**
 * @swagger
 * /teachers/accept:
 *   post:
 *     summary: Accept a teacher application
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *             properties:
 *               teacherId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Teacher application accepted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Teacher not found
 */
router.post('/accept', TeacherController.acceptTeacherApplication)
/**
 * @swagger
 * /teachers/reject:
 *   post:
 *     summary: Reject a teacher application
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *               - reason
 *             properties:
 *               teacherId:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Teacher application rejected successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Teacher not found
 */
router.post('/reject', TeacherController.rejectTeacherApplication)
/**
 * @swagger
 * /teachers/interview:
 *   post:
 *     summary: Schedule an interview for a teacher applicant
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
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
 *               interviewDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Interview scheduled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Teacher not found
 */
router.post('/interview', TeacherController.interviewTeacherApplicant)

export default router
