import { Request, Response, NextFunction } from "express";
import { JwtService } from "../utils/jwt";
import { error } from "../utils/response";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        telegramId: string;
      };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;

  if (!auth) {
    return error(res, "Unauthorized", 401);
  }

  const token = auth.split(" ")[1];

  if (!token) {
    return error(res, "Unauthorized", 401);
  }

  try {
    const payload = JwtService.verify(token);

    req.user = payload as any;

    next();
  } catch {
    return error(res, "Invalid token", 401);
  }
}
