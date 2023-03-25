import { randomUUID } from "crypto";
import { Wallet } from "../models/Wallet.Model";
import { Response, Request, NextFunction } from "express";
import { User } from "../models/User.Model";
import { Auth } from "../models/Auth.Model";

export class WalletController {
	// Create a new wallet for a user
	// This is not expected to be called from here as wallet are created for users at the point of registration
	// Nonetheless in cases where users can have multiple wallets in the app, this becomes useful
	public static async createWallet(req: Request, res: Response, next: NextFunction): Promise<void> {
		
		try {
			// Verify session token
			if(req.headers.authorization === undefined || req.headers.authorization.length < 2){
				res.status(401).json({status: "error", success: false, message: "Unauthorized request"});
				return;
			}
			let token: string = req.headers.authorization.replace("Bearer ","");
			const user = await Auth.getUserbyToken(token); 
		
			const wallet = new Wallet(randomUUID().replace("-","").slice(0, 10), user.id, 0);
			res.status(201).json({
				status: true,
				success: true,
				data: wallet
			});
			return;
		} catch (err) {
			console.error(err);
			res.status(500).json({
				status: true,
				success: false,
				error: err.message
			});
			return;
		}
	}

  // Get the balance of a user's wallet
	public static async getBalance(req: Request, res: Response): Promise<void> {
		try {
			// Verify session token
			if(req.headers.authorization === undefined || req.headers.authorization.length < 2){
				res.status(401).json({status: "error", success: false, message: "Unauthorized request"});
				return;
			}
			let token: string = req.headers.authorization.replace("Bearer ","");
			const user = await Auth.getUserbyToken(token); 
			
			const balance = await (await Wallet.findByUserId(user.id)).getBalance();
			res.json({
				status: true,
				success: true,
				data: balance
			});
			return;
		} catch (err) {
			console.error(err);
			res.status(500).json({
				status: true,
				success: false,
				error: err.message
			});
			return;
		}
	}

	// Add funds
	public static async addFunds(req: Request, res: Response): Promise<void> {
		// Check missing params
        let missingParam:boolean = false;
        let errmsg:string = "";
        if(req.body.amount === undefined || isNaN(req.body.amount) || req.body.amount <= 1){
            missingParam = true;
            errmsg = "Amount is missing or less than 0";
        } else if(req.body.narration === undefined || req.body.narration < 2){
            req.body.narration = "";
        }

        // Return error if there is a missing param
        if(missingParam === true){
            res.status(400).json({
                status: "error",
                success: false,
                message: errmsg
            });
            return;
        }

		try {
			// Verify session token
			if(req.headers.authorization === undefined || req.headers.authorization.length < 2){
				res.status(401).json({status: "error", success: false, message: "Unauthorized request"});
				return;
			}
			let token: string = req.headers.authorization.replace("Bearer ","");
			const user = await Auth.getUserbyToken(token); 

			const amount = req.body.amount;
			const description = req.body.description;
			const transaction = await (await Wallet.findByUserId(user.id)).addFunds(amount, description);
			
			res.status(201).json({
				status:true,
				success: true,
				data: {
					reference: transaction.reference,
					sender: (await User.findById(transaction.fromUserId)).email,
					recipient: (await User.findById(transaction.toUserId)).email,
					amount: transaction.amount,
					createdAt: transaction.createdAt
				}
			});
			return;
		} catch (err) {
			console.error(err);
			res.status(500).json({ status:true, success: false, error: err.message });
			return;
		}
	}

  // Withdraw funds
	public static async withdrawFunds(req: Request, res: Response): Promise<void> {
		// Check missing params
        let missingParam:boolean = false;
        let errmsg:string = "";
        if(req.body.amount === undefined || isNaN(req.body.amount) || req.body.amount <= 1){
            missingParam = true;
            errmsg = "Amount is missing or less than 0";
        } else if(req.body.narration === undefined || req.body.narration < 2){
            req.body.narration = "";
        }

        // Return error if there is a missing param
        if(missingParam === true){
            res.status(400).json({
                status: "error",
                success: false,
                message: errmsg
            });
            return;
        }

		try {
			// Verify session token
			if(req.headers.authorization === undefined || req.headers.authorization.length < 2){
				res.status(401).json({status: "error", success: false, message: "Unauthorized request"});
				return;
			}
			let token: string = req.headers.authorization.replace("Bearer ","");
			const user = await Auth.getUserbyToken(token); 

			const amount = req.body.amount;
			const description:string = req.body.narration;
			const transaction = await (await Wallet.findByUserId(user.id)).withdrawFunds(amount, description);
			res.status(200).json({
				status:true,
				success: true,
				data: {
					reference: transaction.reference,
					sender: (await User.findById(transaction.fromUserId)).email,
					recipient: (await User.findById(transaction.toUserId)).email,
					amount: transaction.amount,
					createdAt: transaction.createdAt
				}
			});
			return;
		} catch (err) {
			console.error(err);
			res.status(500).json({ status: true, success: false, error: err.message });
			return;
		}
	}
  
  // Transfer funds function
	public static async transferFunds(req: Request, res: Response): Promise<void> {
		
		// Check missing params
		let missingParam:boolean = false;
		let errmsg:string = "";
		if(req.body.amount === undefined || isNaN(req.body.amount) || req.body.amount <= 0){
			missingParam = true;
			errmsg = "Amount is missing or less than 0";
		} else if(req.body.recipient_email === undefined || req.body.recipient_email.length < 2){
			missingParam = true;
			errmsg = "Recipient is missing or too short";
		} else if(req.body.narration === undefined || req.body.narration < 2){
			req.body.narration = "";
		}

		// Return error if there is a missing param
		if(missingParam === true){
			res.status(400).json({
				status: "error",
				success: false,
				message: errmsg
			});
			return;
		}

		try {
			// Verify session token
			if(req.headers.authorization === undefined || req.headers.authorization.length < 2){
				res.status(401).json({status: "error", success: false, message: "Unauthorized request"});
				return;
			}
			let token: string = req.headers.authorization.replace("Bearer ","");
			const user = await Auth.getUserbyToken(token); 

			const amount = req.body.amount;
			const recipientEmail = req.body.recipient_email;
			const description = req.body.narration;

			// Get recipient user object
			const recipient = await User.findByEmail(recipientEmail);
			// Do transfer
			const transaction = await (await Wallet.findByUserId(user.id)).transfer(amount, recipient);
			res.status(200).json({
				status:true,
				success: true,
				data: {
					reference: transaction.reference,
					sender: (await User.findById(transaction.fromUserId)).email,
					recipient: (await User.findById(transaction.toUserId)).email,
					amount: transaction.amount,
					createdAt: transaction.createdAt
				}
			});
		} catch (err) {
			console.error(err);
			res.status(500).json({ status: true, success: false, error: err.message });
		}
	}
  
} 