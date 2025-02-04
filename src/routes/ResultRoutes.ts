import express from 'express'
import { ResultController } from '@/controllers/ResultController.js'

const router = express.Router()

/**
 * @route   POST /results
 * @desc    Record marks for a student in an exam subject
 * @access  Private (Teacher)
 */
router.post('/', ResultController.recordMarks)

/**
 * @route   GET /results/students/:studentId
 * @desc    Fetch results for a specific student
 * @access  Private (Student/Teacher/Admin)
 */
router.get('/students/:studentId', ResultController.getResultsForStudent)

/**
 * @route   GET /results/exams/:examId
 * @desc    Fetch results for a specific exam
 * @access  Private (Teacher/Admin)
 */
router.get('/exams/:examId', ResultController.getResultsForExam)

/**
 * @route   POST /results/calculate-grade
 * @desc    Calculate grade based on marks obtained
 * @access  Private (Teacher/Admin)
 */
router.post('/calculate-grade', ResultController.calculateGrade)

export default router

/* --------------------------------------------------------------------------
     Swagger/OpenAPI Documentation
     
     Below are the complete details for each result-related endpoint.
     Use this section as a guide for adding new endpoints.
     
     The documentation includes descriptions, parameters, request bodies,
     example payloads, responses, and error responses, following the OpenAPI 3.0 standard.
 --------------------------------------------------------------------------- */

/**
 * @swagger
 * tags:
 *   - name: Results
 *     description: API endpoints for managing exam results.
 */

/**
 * @swagger
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
 *           type: number
 *         examSubjectId:
 *           type: number
 *         marksObtained:
 *           type: number
 *       required:
 *         - studentId
 *         - examSubjectId
 *         - marksObtained
 *     Result:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         studentId:
 *           type: number
 *         examSubjectId:
 *           type: number
 *         marksObtained:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - studentId
 *         - examSubjectId
 *         - marksObtained
 *         - createdAt
 *     GradeCalculationInput:
 *       type: object
 *       properties:
 *         marksObtained:
 *           type: number
 *       required:
 *         - marksObtained
 *     GradeCalculationOutput:
 *       type: object
 *       properties:
 *         grade:
 *           type: string
 *       required:
 *         - grade
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           default: false
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /results:
 *   post:
 *     summary: Record marks for a student in an exam subject
 *     tags:
 *       - Results
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Data required to record marks
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResultInput'
 *           examples:
 *             recordMarksExample:
 *               summary: Recording marks for a student
 *               value:
 *                 studentId: 101
 *                 examSubjectId: 20
 *                 marksObtained: 85
 *     responses:
 *       201:
 *         description: Marks recorded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Result'
 *       400:
 *         description: Invalid input or error while recording marks.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /results/students/{studentId}:
 *   get:
 *     summary: Fetch results for a specific student
 *     tags:
 *       - Results
 *     parameters:
 *       - in: path
 *         name: studentId
 *         description: ID of the student whose results are being retrieved
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Successfully retrieved results for the student.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Result'
 *       400:
 *         description: Invalid student ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No results found for the specified student.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /results/exams/{examId}:
 *   get:
 *     summary: Fetch results for a specific exam
 *     tags:
 *       - Results
 *     parameters:
 *       - in: path
 *         name: examId
 *         description: ID of the exam for which the results are being retrieved
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Successfully retrieved results for the exam.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Result'
 *       400:
 *         description: Invalid exam ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No results found for the specified exam.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /results/calculate-grade:
 *   post:
 *     summary: Calculate grade based on marks obtained
 *     tags:
 *       - Results
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Marks obtained used to calculate the grade
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradeCalculationInput'
 *           examples:
 *             calculateGradeExample:
 *               summary: Grade calculation input example
 *               value:
 *                 marksObtained: 92
 *     responses:
 *       200:
 *         description: Grade calculated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GradeCalculationOutput'
 *       400:
 *         description: Invalid input data for grade calculation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
