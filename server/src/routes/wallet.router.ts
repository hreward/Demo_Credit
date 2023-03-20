import express from 'express';
import { WalletController } from '../controllers/wallet.controller';

const router = express.Router();

// Create a new wallet for a user
// router.post('/wallets/:userId/wallets', WalletController.createWallet);

// Get the balance of a user's wallet
router.get('/wallets/:userId/balance', WalletController.getBalance);

// Add funds to a user's wallet
router.post('/wallets/:userId/funds', WalletController.addFunds);

// Withdraw funds from a user's wallet
router.post('/wallets/:userId/withdraw', WalletController.withdrawFunds);

// Transfer funds from a user's wallet to another
router.post('/wallets/:userId/transfer', WalletController.transferFunds);

export default router;
