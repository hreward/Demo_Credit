import { Response, Request } from "express";
import { Transaction } from "../models/Transaction.Model";
import { User } from "../models/User.Model";
import { Auth } from "../models/Auth.Model";

export class TransactionController {
    public static async getUserTransactions ( req: Request, res: Response ): Promise<void> {
        try {
			// Verify session token
			if(req.headers.authorization === undefined || req.headers.authorization.length < 2){
				res.status(401).json({status: "error", success: false, message: "Unauthorized request"});
				return;
			}
			let token: string = req.headers.authorization.replace("Bearer ","");
			const user = await Auth.getUserbyToken(token); 
            
            const transactions = await Transaction.findAllByUserId(user.id);
            
            // Iterate through the transactions and assigned returnable properties
            var tranx = [];
            for (const transaction of transactions) {
				let tran = {
					reference: transaction.reference,
					sender: (await User.findById(transaction.fromUserId)).email,
					recipient: (await User.findById(transaction.toUserId)).email,
					amount: transaction.amount,
					createdAt: transaction.createdAt
				}
                tranx.push(tran);
            };
            res.status(200).json({
                status: true,
                success: true,
                message: "Transactions retrieved successfully",
                data: tranx
            });
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: true,
                success: false,
                message: "An error occurred while retrieving transactions",
            });
            return
        }
    };


    public static async getTransaction ( req: Request, res: Response ): Promise<void> {
		// Check missing params
        let missingParam:boolean = false;
        let errmsg:string = "";
        if(req.params.id === undefined || req.params.id.length < 1){
            missingParam = true;
            errmsg = "Transaction id is missing";
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

            const transactionId = req.params.id;
            const transaction = await Transaction.findTransactionByUserId(transactionId, user.id);
            res.status(200).json({
                status: true,
                success: true,
                message: "Transaction retrieved successfully",
				data: {
					reference: transaction.reference,
					sender: (await User.findById(transaction.fromUserId)).email,
					recipient: (await User.findById(transaction.toUserId)).email,
					amount: transaction.amount,
					createdAt: transaction.createdAt
				}
            });
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: true,
                success: false,
                message: error.message,
            });
            return;
        }
    };
}