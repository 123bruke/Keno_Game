import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { success, error } from "../utils/response";

export class AuthController {
  private authService = new AuthService();

  telegramLogin = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.telegramLogin(req.body);

      return success(res, result, "Login successful");
    } catch (err) {
      console.error(err);

      return error(res, "Authentication failed", 500);
    }
  };
}
