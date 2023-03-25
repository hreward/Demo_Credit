import { randomUUID } from "crypto";
import { User } from "./User.Model";
import bcrypt from "bcrypt";

describe("User", ()=>{
    const userRef = randomUUID().replace('-', '');
    const user = new User(userRef, "first name", "last name", "email@email.com", "123abc", new Date(), new Date());
    describe("Verify password", ()=>{
        it("should verify password i.e password string should match hash and return true", async ()=>{
            // Vars
            var bcryptCall = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

            // Calls
            const result = await user.verifyPassword("123abc");

            // Check
            expect(bcrypt.compare).toHaveBeenCalledTimes(1);
            expect(result).toBe(true);

            bcryptCall.mockRestore();
        });
        it("should fail password verification and return false", async ()=>{
            // Vars
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

            // Calls
            const result = await user.verifyPassword("abc123");

            // Check
            expect(bcrypt.compare).toHaveBeenCalledTimes(1);
            expect(result).toBe(false);
        });
    });
    describe("Set password", ()=>{
        it("should set user password", async ()=>{
            // Vars
            jest.spyOn(bcrypt, 'hash').mockResolvedValue(true as never);

            // Calls
            const result = await user.setPassword("123abc");

            // Check
            expect(bcrypt.hash).toHaveBeenCalledTimes(1);
        });
    });
    describe("Find User by email", ()=>{
        it("should find user by email and return user", async ()=>{
            // Vars
            jest.spyOn(User, 'findByEmail').mockResolvedValue(user);

            // Calls
            const result = await User.findByEmail(user.email);

            // Check
            expect(result).toEqual(user);
        });
        it("should not be able to find user by email and return error", async ()=>{
            // Vars
            jest.spyOn(User, 'findByEmail').mockResolvedValue(new Error(`User with email ${user.email} not found`) as any);

            // Calls
            const result = await <any>User.findByEmail("wrong@email.com");

            // Check
            expect(result.message).toEqual(`User with email ${user.email} not found`);
        });
    });
    describe("Find User by user id", ()=>{
        it("should find user by user id and return user", async ()=>{
            // Vars
            jest.spyOn(User, 'findById').mockResolvedValue(user);

            // Calls
            const result = await User.findById(user.id);

            // Check
            expect(result).toEqual(user);
        });
        it("should not be able to find user by user id and return error", async ()=>{
            // Vars
            jest.spyOn(User, 'findById').mockResolvedValue(new Error(`User with id ${user.id} not found`) as any);

            // Calls
            const result = await <any>User.findById("wrong-user-id");

            // Check
            expect(result.message).toEqual(`User with id ${user.id} not found`);
        });
    });
});