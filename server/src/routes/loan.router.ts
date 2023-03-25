import express from 'express';
import { LoanController } from '../controllers/loan.controller';

const router = express.Router();

// Get the balance of a user's wallet
router.post('/takeloan', LoanController.createLoan);

// Add funds to a user's wallet
router.get('/:id', LoanController.getLoan);

// Withdraw funds from a user's wallet
router.post('/:userId/repay', LoanController.repayLoan);

export default router;
