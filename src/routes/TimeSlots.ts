import express from 'express'
import { TimeSlotController } from '@/controllers/TimeSlotController'
import authWithRBAC from '@/middleware/auth.middleware.js'

const router = express.Router()

/**
 * @openapi
 * /time-slots:
 *   post:
 *     tags:
 *       - Time Slots
 *     summary: Create time slots for a class
 *     description: Creates one or more time slots for a specific class
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classId:
 *                 type: string
 *                 description: ID of the class
 *               slots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       201:
 *         description: Time slots created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */
router.post(
    '/time-slots',
    authWithRBAC(['ADMIN']),
    TimeSlotController.createTimeSlots,
)

/**
 * @openapi
 * /time-slots/{id}:
 *   put:
 *     tags:
 *       - Time Slots
 *     summary: Update a time slot
 *     description: Updates an existing time slot by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Time slot ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Time slot updated successfully
 *       404:
 *         description: Time slot not found
 *       500:
 *         description: Server error
 */
router.put(
    '/time-slots/:id',
    authWithRBAC(['ADMIN']),
    TimeSlotController.updateTimeSlot,
)

/**
 * @openapi
 * /time-slots/{id}:
 *   delete:
 *     tags:
 *       - Time Slots
 *     summary: Delete a time slot
 *     description: Deletes an existing time slot by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Time slot ID
 *     responses:
 *       204:
 *         description: Time slot deleted successfully
 *       404:
 *         description: Time slot not found
 *       500:
 *         description: Server error
 */
router.delete(
    '/time-slots/:id',
    authWithRBAC(['ADMIN']),
    TimeSlotController.deleteTimeSlot,
)
export default router
