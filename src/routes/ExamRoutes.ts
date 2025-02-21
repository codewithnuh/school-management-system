import express from 'express'
import { ExamController } from '@/controllers/ExamController.js'
import authWithRBAC from '@/middleware/auth.middleware.js'

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: Exams
 *     description: API endpoints for managing exams.
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
 *     Exam:
 *       type: object
 *       properties:
 *         examId:
 *           type: number
 *         examName:
 *           type: string
 *         academicYear:
 *           type: string
 *         classId:
 *           type: number
 *         sectionId:
 *           type: number
 *         examDate:
 *           type: string
 *           format: date
 *         totalMarks:
 *           type: number
 *         passingMarks:
 *           type: number
 *         examType:
 *           type: string
 *         description:
 *           type: string
 *         isPublished:
 *           type: boolean
 *       required:
 *         - examName
 *         - classId
 *         - examDate
 *         - academicYear
 *         - totalMarks
 *     ExamResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           $ref: '#/components/schemas/Exam'
 *         message:
 *           type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           default: false
 *         message:
 *           type: string
 *
 */

/**
 * @openapi
 * /exams:
 *   post:
 *     summary: Create a new exam
 *     tags:
 *       - Exams
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Exam creation data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exam'
 *           examples:
 *             exam:
 *               summary: Exam creation payload
 *               value:
 *                 examName: "Midterm Exam"
 *                 classId: 1
 *                 examDate: "2023-07-15"
 *                 academicYear: "2023-2024"
 *                 totalMarks: 100
 *                 passingMarks: 40
 *                 examType: "Unit Test"
 *                 description: "Midterm examination for 10th grade students"
 *                 isPublished: false
 *     responses:
 *       201:
 *         description: Exam created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExamResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', authWithRBAC(['ADMIN']), ExamController.createExam)

/**
 * @openapi
 * /exams:
 *   get:
 *     summary: Fetch all exams
 *     tags:
 *       - Exams
 *     responses:
 *       200:
 *         description: List of exams retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exam'
 *       500:
 *         description: Server error retrieving exams.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', ExamController.getAllExams)

/**
 * @openapi
 * /exams/{id}:
 *   get:
 *     summary: Fetch an exam by ID
 *     tags:
 *       - Exams
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Numeric ID of the exam to fetch
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Exam retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exam'
 *       400:
 *         description: Invalid exam ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Exam not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', ExamController.getExamById)

/**
 * @openapi
 * /exams/{id}:
 *   put:
 *     summary: Update an exam
 *     tags:
 *       - Exams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Numeric ID of the exam to update
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       description: Updated exam data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exam'
 *           examples:
 *             exam:
 *               summary: Updated exam payload
 *               value:
 *                 examName: "Updated Midterm Exam"
 *                 classId: 1
 *                 examDate: "2023-07-20"
 *                 academicYear: "2023-2024"
 *                 totalMarks: 100
 *                 passingMarks: 40
 *                 examType: "Unit Test"
 *                 description: "Updated information for midterm exam"
 *                 isPublished: false
 *     responses:
 *       200:
 *         description: Exam updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exam'
 *       400:
 *         description: Invalid exam ID or input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Exam not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', ExamController.updateExam)

/**
 * @openapi
 * /exams/{id}:
 *   delete:
 *     summary: Delete an exam
 *     tags:
 *       - Exams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Numeric ID of the exam to delete
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       204:
 *         description: Exam deleted successfully. No content returned.
 *       400:
 *         description: Invalid exam ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Exam not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', ExamController.deleteExam)

export default router
