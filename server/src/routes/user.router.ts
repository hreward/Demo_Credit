import express from 'express';
import { UserController } from '../controllers/user.controller';

const router = express.Router();

// Get the balance of a user's wallet
router.put('/create', UserController.createUser);

// Add funds to a user's wallet
router.post('/update', UserController.updateUser);

// Withdraw funds from a user's wallet
router.delete('/delete', UserController.deleteUser);

export default router;
