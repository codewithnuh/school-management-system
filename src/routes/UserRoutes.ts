import express from 'express'
import UserController from '@/controllers/UserController'
const router = express.Router()
router.post('/', UserController.createUser)
router.get('/', UserController.getAllUsers)
router.delete('/', UserController.deleteUser)
router.patch('/:token', UserController.resetUserPassword)
router.post('/auth/login', UserController.login)
export default router
