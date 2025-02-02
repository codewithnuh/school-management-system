/**
 * @openapi
 * tags:
 *   name: Sections
 *   description: Section management endpoints
 */

import { SectionController } from '@/controllers/SectionController'
import express from 'express'
const sectionRoutes = express.Router()

/**
 * @openapi
 * /sections:
 *   post:
 *     tags: [Sections]
 *     summary: Create a new section
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               classId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Section created successfully
 *       400:
 *         description: Invalid request body
 */
sectionRoutes.post('/', SectionController.createSection)

/**
 * @openapi
 * /sections/class/{classId}:
 *   get:
 *     tags: [Sections]
 *     summary: Get all sections for a class
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of sections
 *       404:
 *         description: Class not found
 */
sectionRoutes.get('/class/:classId', SectionController.getAllSections) // Get sections by classId

/**
 * @openapi
 * /sections/{id}:
 *   get:
 *     tags: [Sections]
 *     summary: Get section by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Section details
 *       404:
 *         description: Section not found
 */
sectionRoutes.get('/:id', SectionController.getSectionById)

/**
 * @openapi
 * /sections/{id}:
 *   put:
 *     tags: [Sections]
 *     summary: Update a section
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               classId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Section updated successfully
 *       404:
 *         description: Section not found
 */
sectionRoutes.put('/:id', SectionController.updateSection)

/**
 * @openapi
 * /sections/{id}:
 *   delete:
 *     tags: [Sections]
 *     summary: Delete a section
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Section deleted successfully
 *       404:
 *         description: Section not found
 */
sectionRoutes.delete('/:id', SectionController.deleteSection)
