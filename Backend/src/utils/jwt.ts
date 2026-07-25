import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  userId: string;
  telegramId: bigint;
}

export class JwtService {
  static sign(payload: JwtPayload) {
    return jwt.sign(
      {
        userId: payload.userId,
        telegramId: payload.telegramId.toString(),
      },
      env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
  }

  static verify(token: string) {
    return jwt.verify(token, env.JWT_SECRET);
  }
}
