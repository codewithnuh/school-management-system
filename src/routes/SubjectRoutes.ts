// subject.routes.ts
import { Router } from 'express'
import { SubjectController } from '@/controllers/SubjectController.js'

const router = Router()

/**
 * @openapi
 * tags:
 *   - name: Subjects
 *     description: API endpoints for managing subjects.
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
 *     SubjectInput:
 *       type: object
 *       properties:
 *         subjectName:
 *           type: string
 *           example: "Mathematics"
 *         subjectCode:
 *           type: string
 *           example: "MATH101"
 *       required:
 *         - subjectName
 *         - subjectCode
 *     Subject:
 *       type: object
 *       properties:
 *         subjectId:
 *           type: integer
 *           example: 1
 *         subjectName:
 *           type: string
 *           example: "Mathematics"
 *         subjectCode:
 *           type: string
 *           example: "MATH101"
 *       required:
 *         - subjectName
 *         - subjectCode
 *     SubjectResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Subject'
 *         message:
 *           type: string
 *           example: "Subject created successfully"
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
 * /subjects:
 *   post:
 *     summary: Create a new subject
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Subject information for creating a new subject
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubjectInput'
 *           examples:
 *             newSubject:
 *               summary: New subject input example
 *               value:
 *                 subjectName: "Physics"
 *                 subjectCode: "PHYS101"
 *     responses:
 *       201:
 *         description: Subject created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectResponse'
 *       400:
 *         description: Invalid input or error adding subject.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', SubjectController.create)

/**
 * @openapi
 * /subjects/{subjectId}:
 *   get:
 *     summary: Get a subject by ID
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         description: Numeric ID of the subject to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Subject retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectResponse'
 *       400:
 *         description: Invalid subject ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Subject not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', SubjectController.getById)

/**
 * @openapi
 * /subjects:
 *   get:
 *     summary: Get all subjects
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subjects retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Error retrieving subjects.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', SubjectController.getAll)

/**
 * @openapi
 * /subjects/{subjectId}:
 *   put:
 *     summary: Update a subject by ID
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         description: Numeric ID of the subject to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Updated subject data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubjectInput'
 *           examples:
 *             updateSubject:
 *               summary: Updated subject input example
 *               value:
 *                 subjectName: "Advanced Physics"
 *                 subjectCode: "PHYS201"
 *     responses:
 *       200:
 *         description: Subject updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectResponse'
 *       400:
 *         description: Invalid subject ID or input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Subject not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', SubjectController.update)

/**
 * @openapi
 * /subjects/{subjectId}:
 *   delete:
 *     summary: Delete a subject by ID
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         description: Numeric ID of the subject to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Subject deleted successfully. No content returned.
 *       400:
 *         description: Invalid subject ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Subject not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', SubjectController.delete)

export default router
