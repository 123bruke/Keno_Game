import prisma from "../config/prisma";

export class UserRepository {
  async findByTelegramId(telegramId: bigint) {
    return prisma.user.findUnique({
      where: { telegramId },
      include: {
        wallet: true,
      },
    });
  }

  async create(data: {
    telegramId: bigint;
    username?: string;
    firstName?: string;
    lastName?: string;
  }) {
    return prisma.user.create({
      data: {
        ...data,
        wallet: {
          create: {},
        },
      },
      include: {
        wallet: true,
      },
    });
  }
}
