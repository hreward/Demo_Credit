import { Response, Request, NextFunction } from "express";
import { User } from "../models/User.Model";
import { checkRequiredParam } from "../helper";
import { randomUUID } from "crypto";
import { Wallet } from "../models/Wallet.Model";


export class UserController{
    // Create a new user
    public static async createUser (req: Request, res: Response, next:NextFunction): Promise<void> {
        checkRequiredParam("email")(req, res, next);
        checkRequiredParam("password")(req, res, next);
        checkRequiredParam("firstname")(req, res, next);
        checkRequiredParam("lastname")(req, res, next);
        try {
            const { firstname, lastname, email, password } = req.body;
            const user = new User(randomUUID().replace("-","").slice(0, 10), firstname, lastname, email, password);
            const wallet = new Wallet(randomUUID().replace("-","").slice(0, 10), user.id, 0);
            await user.save();
            await wallet.save();
            res.status(201).json({
                status: true,
                success: true,
                message: "User created successfully",
                data: user
            });
        } catch (error) {
            res.status(400).json({
                status: true,
                success: false,
                message: error.message,
            });
        }
    };

    // Update a user details
    public static async updateUser (req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const { firstname, lastname, password } = req.body;
        // TODO get email from session
        var email = "gottenFromSession";
        const user = User.findByEmail(email);
        if (!user) throw new Error("User not found");

        if(firstname && firstname.length > 0){
            (await user).firstName = firstname;
        }
        if(lastname && lastname.length > 0){
            (await user).lastName = lastname;
        }
        if(password && password.length > 0){
            (await user).setPassword(password);
        }
        await (await user).save();

        res.status(200).json({
            status: true,
            success: true,
            message: "User updated successfully",
        });
    } catch (error) {
        res.status(400).json({
            status: true,
            success: false,
            message: error.message,
        });
    }
    };

    // delete a user
    public static async deleteUser (req: Request, res: Response): Promise<void> {
    try {
        // TODO get email from session
        const email = req.params.email;
        const user = await User.findByEmail(email);
        if (!user) throw new Error("User not found");
        res.status(204).json({
            status: true,
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            status: true,
            success: false,
            message: error.message,
        });
    }
    };

}