import express from 'express'
import { FeeCategoryController } from '@/controllers/FeeCategoryController.js' // Adjust path
import { FeeStructureController } from '@/controllers/FeeStructureController.js'
import authWithRBAC from '@/middleware/auth.middleware.js'

const router = express.Router()

// Fee Category Routes
router.post(
    '/fee-categories',
    authWithRBAC(['ADMIN']),
    FeeCategoryController.createFeeCategory,
)
router.get(
    '/fee-categories',
    authWithRBAC(['ADMIN']),
    FeeCategoryController.getAllFeeCategories,
)
router.get(
    '/fee-categories/:id',
    authWithRBAC(['ADMIN']),
    FeeCategoryController.getFeeCategoryById,
)
router.put(
    '/fee-categories/:id',
    authWithRBAC(['ADMIN']),
    FeeCategoryController.updateFeeCategory,
)
router.delete(
    '/fee-categories/:id',
    authWithRBAC(['ADMIN']),
    FeeCategoryController.deleteFeeCategory,
)

// Fee Structure Routes
router.post(
    '/fee-structures',
    authWithRBAC(['ADMIN']),
    FeeStructureController.createFeeStructure,
)
// ... (and so on for other controllers and methods)

export default router
