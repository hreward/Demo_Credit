import { Response, Request } from "express";
import { Auth } from "../models/Auth.Model";

export class AuthController {
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
            return;
        }
    }

    // Logout
    public static async logout(req: Request, res: Response): Promise<void> {
        try {
            if(req.headers.authorization === undefined || req.headers.authorization.length < 2){
                res.status(401).json({status: "error", success: false, message: "Unauthorized request"});
                return;
            }
            let token: string|undefined = req.headers.authorization.replace("Bearer ","");
            const user = await Auth.getUserbyToken(token); 

            await Auth.unAuthorizeUser(user.id);
            res.status(201).json({ status: true, success: true, message: "Logout successful" });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                success: false,
                message: error.message,
            });
            return;
        }
    }

}
