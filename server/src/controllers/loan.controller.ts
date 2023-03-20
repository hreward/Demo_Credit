import { Response, Request } from "express";
import { Loan } from "../models/Loan.Model";
import { User } from "../models/User.Model";
import { randomUUID } from "crypto";
import { Wallet } from "../models/Wallet.Model";

export class LoanController {
    // create loan
    public static async createLoan(req: Request, res: Response): Promise<void> {
        try {
            const { userId, amount } = req.body;
            const user = await User.findById(userId);
            const loan = new Loan(randomUUID().replace("-","").slice(0, 10), user.id, amount, "active");
            const loanId = await loan.save();
            res.status(201).json({ message: "Loan created successfully", loanId });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                success: false,
                message: error.message,
            });
        }
    }

    // Get loan
    public static async getLoan(req: Request, res: Response): Promise<void> {
        try {
            const { loanId } = req.params;
            const loan = await Loan.findById(loanId);
            if (!loan) {
                res.status(404).json({ error: "Loan not found" });
                return;
            }
            res.json({ loan });   
        } catch (error) {
            res.status(400).json({
                status: 'error',
                success: false,
                message: error.message,
            });
        }
    }

    // Repay loan
    public static async repayLoan(req: Request, res: Response): Promise<void> {
        
        try {
            const { loanId, amount } = req.body;
            const loan = await Loan.findById(loanId);
            if (loan.status !== "active") {
                throw Error("Loan is not active" );
            }
            const wallet = await Wallet.findByUserId(loan.userId);
            if (wallet.balance < amount) {
                res.status(400).json({ error: "Insufficient balance" });
            }
        
            wallet.balance -= amount;
            wallet.withdrawFunds(amount, `Repayment for loan ${loan.reference}`);
            loan.amount -= amount;
            let message:string = `${amount} is has been repaid for loan successfully`;
            if (loan.amount <= 0) {
                loan.status = "repaid";
                message = `${amount} is has been repaid. Loan has been repaid completely`;
            }
            loan.save();

            res.status(400).json({
                status: true,
                success: true,
                message: message
            });

        } catch (error) {
            res.status(400).json({
                status: 'error',
                success: false,
                message: error.message,
            });
        }
    }

}
