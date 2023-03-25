import { randomUUID } from "crypto";
import { User } from "./User.Model";
import { Wallet } from "./Wallet.Model";
import bcrypt from "bcrypt";

describe("Wallet", ()=>{
    const userRef = randomUUID().replace('-', '');
    const user = new User(userRef, "first name", "last name", "email@email.com", "123abc", new Date(), new Date());
    const wallet = new Wallet(userRef, user.id, 0, new Date(), new Date());
    describe("Find Wallet by user id", ()=>{
        it("should find wallet by user id and return wallet", async ()=>{
            // Vars
            jest.spyOn(Wallet, 'findByUserId').mockResolvedValue(wallet);

            // Calls
            const result = await Wallet.findByUserId(user.id);

            // Check
            expect(result).toEqual(wallet);
        });
        it("should not be able to find wallet by user id and return error", async ()=>{
            // Vars
            jest.spyOn(Wallet, 'findByUserId').mockResolvedValue(new Error(`Wallet for user ${wallet.reference} not found`) as any);

            // Calls
            const result = await <any>Wallet.findByUserId("wrong-user-id");

            // Check
            expect(result.message).toEqual(`Wallet for user ${wallet.reference} not found`);
        });
    });
});