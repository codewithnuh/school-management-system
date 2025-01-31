import express from 'express'
import { TimeSlotController } from '@/controllers/TimeSlotController'

const router = express.Router()

// Create time slots for a class
router.post('/time-slots', TimeSlotController.createTimeSlots)
router.put('/time-slots/:id', TimeSlotController.updateTimeSlot)
router.delete('/time-slots/:id', TimeSlotController.deleteTimeSlot)
export default router
