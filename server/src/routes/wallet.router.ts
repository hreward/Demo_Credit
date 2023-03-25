import express from 'express';
import { WalletController } from '../controllers/wallet.controller';

const router = express.Router();

// Get the balance of a user's wallet
router.get('/balance', WalletController.getBalance);

// Add funds to a user's wallet
router.post('/addfunds', WalletController.addFunds);

// Withdraw funds from a user's wallet
router.post('/withdraw', WalletController.withdrawFunds);

// Transfer funds from a user's wallet to another
router.post('/transfer', WalletController.transferFunds);

export default router;
