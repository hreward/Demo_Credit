import { Response, Request } from "express";
import { Transaction } from "../models/Transaction.Model";

export class TransactionController {
    public static async getUserTransactions ( req: Request, res: Response ) {
        try {
            const userId = req.params.userId;
            const transactions = await Transaction.findAllByUserId(userId);
            
            return res.status(200).json({
                status: true,
                success: true,
                message: "Transactions retrieved successfully",
                data: transactions,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: true,
                success: false,
                message: "An error occurred while retrieving transactions",
            });
        }
    };


    public static async getTransaction ( req: Request, res: Response ) {
        try {
            const userId = req.params.userId;
            const transactionId = req.params.userId;
            const transaction = await Transaction.findTransactionByUserId(transactionId, userId);
            
            return res.status(200).json({
                status: true,
                success: true,
                message: "Transaction retrieved successfully",
                data: transaction,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: true,
                success: false,
                message: "An error occurred while retrieving the transaction",
            });
        }
    };
}