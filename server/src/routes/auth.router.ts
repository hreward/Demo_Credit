import express from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = express.Router();

// login
router.post('/login', AuthController.login);

// logout
router.get('/logout', AuthController.logout);

export default router;
