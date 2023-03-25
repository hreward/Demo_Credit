import express from 'express';
import { TransactionController } from '../controllers/transaction.controller';

const router = express.Router();

// Get the balance of a user's wallet
router.get('/:id', TransactionController.getTransaction);

// Add funds to a user's wallet
router.get('/', TransactionController.getUserTransactions);

export default router;
