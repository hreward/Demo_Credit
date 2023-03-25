import { Request, Response } from "express";
import { Auth } from "../models/Auth.Model";
import { AuthController } from "./auth.controller";
import { User } from "../models/User.Model";

jest.mock("../models/Auth.Model");

describe("AuthController", () => {
  describe("login", () => {
    it("should call authenticateUser and authorizeUser methods and return auth token", async () => {
      const email = "test@example.com";
      const password = "password";
      const userId = "getehhjdji";
      const auth_token = "auth_token";

      const req: any = {
        body: {
          email,
          password,
        },
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(Auth, 'authenticateUser').mockResolvedValue(userId);
      jest.spyOn(Auth, 'authorizeUser').mockResolvedValue(auth_token);

      await AuthController.login(req, res);

      expect(Auth.authenticateUser).toHaveBeenCalledWith(email, password);
      expect(Auth.authorizeUser).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        success: true,
        message: "Login successful",
        data: auth_token,
      });
    });

    it("should return error message if login fails", async () => {
      const error = new Error("Invalid email or password");

      const req: any = {
        body: {
          email: "test@example.com",
          password: "password",
        },
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(Auth, 'authenticateUser').mockRejectedValue(error);

      await AuthController.login(req, res);

      expect(Auth.authenticateUser).toHaveBeenCalledWith(req.body.email, req.body.password);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        success: false,
        message: error.message,
      });
    });
  });

  describe("logout", () => {
    it("should call getUserbyToken and unAuthorizeUser methods and return success message", async () => {
      const token = "token";
      const user:User = new User("user_id", "fisrt_name", "last_name", "email.email@email", "password");

      const req: any = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      var thispy = jest.spyOn(Auth, 'getUserbyToken').mockResolvedValue(user);
      jest.spyOn(Auth, 'unAuthorizeUser').mockResolvedValue(user.id);

      await AuthController.logout(req, res);

      expect(Auth.getUserbyToken).toHaveBeenCalledWith(token);
      expect(Auth.unAuthorizeUser).toHaveBeenCalledWith(user.id);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        success: true,
        message: "Logout successful",
      });

      // thispy.mockRestore();
    });

    it("should return error message if getUserbyToken or unAuthorizeUser fails", async () => {
      const error = new Error("Unauthorized request");
      const req: any = {
        headers: {
          authorization: "",
        },
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // jest.spyOn(Auth, 'getUserbyToken').mockRejectedValue(error);

      await AuthController.logout(req, res);

      // expect(Auth.getUserbyToken).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        success: false,
        message: error.message,
      });
    });
  });

  
});

