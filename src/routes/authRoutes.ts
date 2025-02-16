import express, { Request, Response } from 'express';
import { authController } from '../controllers/authController';

const router = express.Router();

router.post('/login', authController.login);
router.post('/login', authController.logout);

export default router;