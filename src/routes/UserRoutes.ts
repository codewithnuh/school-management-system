import express from 'express'
import UserController from '@/controllers/UserController'
const router = express.Router()
router.post('/', UserController.createUser)
router.get('/', UserController.getAllUsers)
router.post('/accept-user', UserController.acceptUserApplication)
router.delete('/', UserController.deleteUser)
router.patch('/auth/reset-token', UserController.resetUserPassword)
router.post('/auth/login', UserController.login)
router.post('/auth/logout', UserController.logout)
export default router
