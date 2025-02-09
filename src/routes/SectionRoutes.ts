import express from 'express'
import { SectionController } from '@/controllers/SectionController.js'

const sectionRoutes = express.Router()

/**
 * @openapi
 * tags:
 *   - name: Sections
 *     description: Section management endpoints
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     SectionInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Section A"
 *         classId:
 *           type: string
 *           example: "101"
 *       required:
 *         - name
 *         - classId
 *     Section:
 *       type: object
 *       properties:
 *         sectionId:
 *           type: string
 *           example: "1"
 *         name:
 *           type: string
 *           example: "Section A"
 *         classId:
 *           type: string
 *           example: "101"
 *       required:
 *         - name
 *         - classId
 *     SectionResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Section'
 *         message:
 *           type: string
 *           example: "Section created successfully"
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
 * /sections:
 *   post:
 *     summary: Create a new section
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Payload to create a new section.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SectionInput'
 *           examples:
 *             sectionInput:
 *               summary: New section input example
 *               value:
 *                 name: "Section A"
 *                 classId: "101"
 *     responses:
 *       201:
 *         description: Section created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SectionResponse'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
sectionRoutes.post('/', SectionController.createSection)

/**
 * @openapi
 * /sections/class/{classId}:
 *   get:
 *     summary: Get all sections for a class
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         description: Unique identifier for the class.
 *         schema:
 *           type: string
 *         example: "101"
 *     responses:
 *       200:
 *         description: List of sections
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
 *                     $ref: '#/components/schemas/Section'
 *                 message:
 *                   type: string
 *                   example: "Sections retrieved successfully"
 *       404:
 *         description: Class not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
sectionRoutes.get('/class/:classId', SectionController.getAllSections)

/**
 * @openapi
 * /sections/{sectionId}:
 *   get:
 *     summary: Get section by ID
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         description: Unique identifier for the section.
 *         schema:
 *           type: string
 *         example: "1"
 *     responses:
 *       200:
 *         description: Section details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SectionResponse'
 *       404:
 *         description: Section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
sectionRoutes.get('/:id', SectionController.getSectionById)

/**
 * @openapi
 * /sections/{sectionId}:
 *   put:
 *     summary: Update a section
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         description: Unique identifier for the section to update.
 *         schema:
 *           type: string
 *         example: "1"
 *     requestBody:
 *       description: Updated section data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SectionInput'
 *           examples:
 *             sectionInput:
 *               summary: Update section input example
 *               value:
 *                 name: "Section A Updated"
 *                 classId: "102"
 *     responses:
 *       200:
 *         description: Section updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SectionResponse'
 *       404:
 *         description: Section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
sectionRoutes.put('/:id', SectionController.updateSection)

/**
 * @openapi
 * /sections/{sectionId}:
 *   delete:
 *     summary: Delete a section
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         description: Unique identifier for the section to delete.
 *         schema:
 *           type: string
 *         example: "1"
 *     responses:
 *       200:
 *         description: Section deleted successfully
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
 *                   example: "Section deleted successfully"
 *       404:
 *         description: Section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
sectionRoutes.delete('/:id', SectionController.deleteSection)

export default sectionRoutes
