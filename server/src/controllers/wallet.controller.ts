import { randomUUID } from "crypto";
import { checkRequiredParam } from "../helper";
import { Wallet } from "../models/Wallet.Model";
import { Response, Request, NextFunction } from "express";
import { User } from "../models/User.Model";

export class WalletController {
	// Create a new wallet for a user
	// This is not expected to be called from here as wallet are created for users at the point of registration
	// Nonetheless in cases where users can have multiple wallets in the app, this becomes useful
	public static async createWallet(req: Request, res: Response, next: NextFunction): Promise<void> {
		
		//get user email from session
		const email = "someone@gmail.com";
		checkRequiredParam("email")(req, res, next);
		
		try {
			const userId = (await User.findByEmail(email)).id;
			const wallet = new Wallet(randomUUID().replace("-","").slice(0, 10), userId, 0);
			res.status(201).json({
				status: true,
				success: true,
				data: wallet
			});
		} catch (err) {
			console.error(err);
			res.status(500).json({
				status: true,
				success: false,
				error: err.message
			});
		}
	}

  // Get the balance of a user's wallet
  public static async getBalance(req: Request, res: Response): Promise<void> {
	try {
		const userId = req.params.userId;
		const balance = (await Wallet.findByUserId(userId)).getBalance();
		res.json({
			status: true,
			success: true,
			data: balance
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: true,
			success: false,
			error: err.message
		});
	}
  }

	// Add funds
	public static async addFunds(req: Request, res: Response): Promise<void> {
		try {
			const userId = req.params.userId;
			const amount = req.body.amount;
			const description = req.body.description;
			const transaction = (await Wallet.findByUserId(userId)).addFunds(amount, description);
			res.status(201).json({ status:true, success: true, data: transaction });
		} catch (err) {
			console.error(err);
			res.status(500).json({ status:true, success: false, error: err.message });
		}
	}

  // Withdraw funds
	public static async withdrawFunds(req: Request, res: Response): Promise<void> {
		try {
			const userId = req.params.userId;
			const amount = req.body.amount;
			const description:string = req.body.description;
			const transaction = (await Wallet.findByUserId(userId)).withdrawFunds(amount, description);
			res.status(201).json({ status: true, success: true, data: transaction });
		} catch (err) {
			console.error(err);
			res.status(500).json({ status: true, success: false, error: err.message });
		}
	}
  
  // Transfer funds function
	public static async transferFunds(req: Request, res: Response): Promise<void> {
		try {
			const userId = req.params.userId;
			const amount = req.body.amount;
			const recipientEmail = req.body.recipient_email;
			const description = req.body.description;

			// Get recipient user object
			const recipient = await User.findByEmail(recipientEmail);
			// Do transfer
			const transaction = (await Wallet.findByUserId(userId)).transfer(amount, recipient);
			res.status(201).json({ status: true, success: true, data: transaction });
		} catch (err) {
			console.error(err);
			res.status(500).json({ status: true, success: false, error: err.message });
		}
	}
  
} 