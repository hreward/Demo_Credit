import { Response, Request } from "express";
import { User } from "../models/User.Model";
import { randomUUID } from "crypto";
import { Wallet } from "../models/Wallet.Model";
import { Auth } from "../models/Auth.Model";

export class LoanController {
    // Logout
    public static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const userId = await Auth.authenticateUser(email, password);
            const auth_token = await Auth.authorizeUser(userId);
            res.status(201).json({ status: true, success: true, message: "Login successful", data: auth_token });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                success: false,
                message: error.message,
            });
        }
    }

    // Logout
    public static async logout(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
            const auth_token = await Auth.unAuthorizeUser(userId);
            res.status(201).json({ status: true, success: true, message: "Logout successful" });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                success: false,
                message: error.message,
            });
        }
    }

}
