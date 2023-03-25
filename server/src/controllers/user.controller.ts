import { Response, Request, NextFunction } from "express";
import { User } from "../models/User.Model";
import { randomUUID } from "crypto";
import { Wallet } from "../models/Wallet.Model";
import { Auth } from "../models/Auth.Model";


export class UserController{
    // Create a new user
    public static async createUser (req: Request, res: Response, next:NextFunction): Promise<void> {
        // Check missing params
        let missingParam:boolean = false;
        let errmsg:string = "";
        if(req.body.firstname === undefined || req.body.firstname < 2){
            missingParam = true;
            errmsg = "firstname is missing or too short";
        } else if(req.body.lastname === undefined || req.body.lastname < 2){
            missingParam = true;
            errmsg = "lastname is missing or too short";
        } else if(req.body.email === undefined || req.body.email < 2){
            missingParam = true;
            errmsg = "email is missing or too short";
        } else if(req.body.password === undefined || req.body.password < 2){
            missingParam = true;
            errmsg = "password is missing or too short";
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
            const { firstname, lastname, email, password } = req.body;
            const user = new User(randomUUID().replace("-","").slice(0, 10), firstname, lastname, email, password);
            const wallet = new Wallet(randomUUID().replace("-","").slice(0, 10), user.id, 0);
            await user.setPassword(password);
            await user.save();
            await wallet.save();
            res.status(201).json({
                status: true,
                success: true,
                message: "User created successfully",
                data: {'firstname': user.firstName, "lastname": user.lastName, "email": user.email, "createdAt": user.createdAt, "updatedAt": user.updatedAt}
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: true,
                success: false,
                message: error.message,
            });
            return;
        }
    };

    // Update a user details
    public static async updateUser (req: Request, res: Response): Promise<void> {
    try {
        if(req.headers.authorization === undefined || req.headers.authorization.length < 2){
            res.status(401).json({status: "error", success: false, message: "Unauthorized request"});
            return;
        }
        let token: string = req.headers.authorization.replace("Bearer ","");
        const user = await Auth.getUserbyToken(token); 

        if(req.body.firstname && req.body.firstname.length > 2){
            user.firstName = req.body.firstname;
        }
        if(req.body.lastname && req.body.lastname.length > 2){
            user.lastName = req.body.lastname;
        }
        if(req.body.password && req.body.password.length > 2){
            await user.setPassword(req.body.password);
        }
        await user.save();

        res.status(200).json({
            status: true,
            success: true,
            message: "User updated successfully",
            data: {'firstname': user.firstName, "lastname": user.lastName, "email": user.email, "createdAt": user.createdAt, "updatedAt": user.updatedAt}
        });
        return;
    } catch (error) {
        res.status(400).json({
            status: true,
            success: false,
            message: error.message,
        });
        return;
    }
    };

    // delete a user
    public static async deleteUser (req: Request, res: Response): Promise<void> {
        try {
            if(req.headers.authorization === undefined || req.headers.authorization.length < 2){
                res.status(401).json({status: "error", success: false, message: "Unauthorized request"});
                return;
            }
            let token: string = req.headers.authorization.replace("Bearer ","");
            const user = await Auth.getUserbyToken(token); 
            await user.delete();
            res.status(204).json({
                status: true,
                success: true,
                message: "User deleted successfully"
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: true,
                success: false,
                message: error.message,
            });
            return;
        }
    };
}