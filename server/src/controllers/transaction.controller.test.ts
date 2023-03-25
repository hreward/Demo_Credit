import { Auth } from "../models/Auth.Model";
import { User } from "../models/User.Model";
import { Transaction } from "../models/Transaction.Model";
import { randomUUID } from "crypto";
import { TransactionController } from "./transaction.controller";

describe("Transactioon controller", ()=>{
    describe("getUserTransaction", ()=>{

        const userRef = randomUUID().replace('-', '');
        const user = new User(userRef, "first name", "last name", "email@email.com", "123abc", new Date(), new Date());
        const req: any = {
            headers: {
                authorization: 'Bearer some-token'
            },
        };

        it("should verify user and call findAllByUserId methods and return transactions", async () => {
            // Variables
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(), 
            };
    
            jest.spyOn(Auth, 'getUserbyToken').mockResolvedValue(user);
            jest.spyOn(Transaction, 'findAllByUserId').mockResolvedValue(expect.any([Transaction]));
    
            // Call
            const transactions = await TransactionController.getUserTransactions(req, res);
    
            // Expect
            expect(Auth.getUserbyToken).toHaveBeenCalledWith('some-token');
            expect(Transaction.findAllByUserId).toHaveBeenCalledWith(user.id);
            expect(transactions).toBe(expect.arrayContaining([expect.any(Transaction)]));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                success: true,
                message: "Login successful",
            });
        });
    });
});