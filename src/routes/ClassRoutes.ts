import express from 'express'
import { ClassController } from '../controllers/ClassController'

const router = express.Router()

/**
 * @openapi
 * /api/classes:
 *   post:
 *     tags:
 *       - Classes
 *     summary: Create a new class
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Class'
 *     responses:
 *       201:
 *         description: Class created successfully
 */
router.post('/', ClassController.createClass)

/**
 * @openapi
 * /api/classes:
 *   get:
 *     tags:
 *       - Classes
 *     summary: Get all classes
 *     responses:
 *       200:
 *         description: List of all classes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Class'
 */
router.get('/', ClassController.getAllClasses)

/**
 * @openapi
 * /api/classes/{id}:
 *   get:
 *     tags:
 *       - Classes
 *     summary: Get a class by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       404:
 *         description: Class not found
 */
router.get('/:id', ClassController.getClassById)

/**
 * @openapi
 * /api/classes/{id}:
 *   put:
 *     tags:
 *       - Classes
 *     summary: Update a class
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
 *             $ref: '#/components/schemas/Class'
 *     responses:
 *       200:
 *         description: Class updated successfully
 *       404:
 *         description: Class not found
 */
router.put('/:id', ClassController.updateClass)

/**
 * @openapi
 * /api/classes/{id}:
 *   delete:
 *     tags:
 *       - Classes
 *     summary: Delete a class
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class deleted successfully
 *       404:
 *         description: Class not found
 */
router.delete('/:id', ClassController.deleteClass)

export default router
