import express from 'express'
import { FeeCategoryController } from '@/controllers/FeeCategoryController.js' // Adjust path
import { FeeStructureController } from '@/controllers/FeeStructureController.js'

const router = express.Router()

// Fee Category Routes
router.post('/fee-categories', FeeCategoryController.createFeeCategory)
router.get('/fee-categories', FeeCategoryController.getAllFeeCategories)
router.get('/fee-categories/:id', FeeCategoryController.getFeeCategoryById)
router.put('/fee-categories/:id', FeeCategoryController.updateFeeCategory)
router.delete('/fee-categories/:id', FeeCategoryController.deleteFeeCategory)

// Fee Structure Routes
router.post('/fee-structures', FeeStructureController.createFeeStructure)
// ... (and so on for other controllers and methods)

export default router
