import express from 'express'
import UserController from '@/controllers/UserController'
const router = express.Router()
router.post('/', UserController.createUser)
router.post('/', UserController.getAllUsers)

export default router
