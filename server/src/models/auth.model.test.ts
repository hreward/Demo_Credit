import { createTracker, MockClient, Tracker } from 'knex-mock-client';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User } from './User.Model';
import { Auth } from './Auth.Model';
import { knex } from './db.model';


describe("AuthController", () => {
    describe("authenticateUser", () => {
        
        it("should return user uuid if email and password match (db calls are skipped)", async () => {
            // Vars
            const email = "gmail@gmail.com";
            const password = "123abc";
            const mockUser = {
                uuid: "getehhjdji",
                email: email,
                password: await bcrypt.hash(password, 10),
            };            
            jest.spyOn(Auth, 'authenticateUser').mockResolvedValue(mockUser.uuid);

            // Calls
            const result = await Auth.authenticateUser(email, password);
        
            // Expect
            expect(result).toBe(mockUser.uuid);
        });
    
        it("should throw an error if email is not found", async () => {
            const email = "test@example.com";
            const password = "password";
            jest.spyOn(Auth, 'authenticateUser').mockResolvedValue(new Error(`User with email ${email} not found`) as any);

            const user = await Auth.authenticateUser(email, password);
            
            expect(user).toEqual(new Error(`User with email ${email} not found`));
        });
    
        it("should throw an error if password is incorrect", async () => {
            const email = "test@example.com";
            const password = "password";
            const user = {
                uuid: "getehhjdji",
                email,
                password: await bcrypt.hash("different_password", 10),
            };
            jest.spyOn(Auth, 'authorizeUser').mockResolvedValue(new Error("Incorrect password") as any);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as unknown as never);
        
            try {
                await Auth.authenticateUser(email, password);
            } catch (error) {
                expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
                expect(error.message).toBe("Incorrect password");
            }
        });
    });
});