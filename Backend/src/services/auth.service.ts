import { UserRepository } from "../repositories/user.repository";
import { JwtService } from "../utils/jwt";

export class AuthService {
  private userRepository = new UserRepository();

  async telegramLogin(data: {
    telegramId: bigint;
    username?: string;
    firstName?: string;
    lastName?: string;
  }) {
    let user = await this.userRepository.findByTelegramId(data.telegramId);

    if (!user) {
      user = await this.userRepository.create(data);
    }

    const token = JwtService.sign({
      userId: user.id,
      telegramId: user.telegramId,
    });

    return {
      user,
      token,
    };
  }
}
