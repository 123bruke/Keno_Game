import prisma from "../config/prisma";

export class WalletRepository {
  async getWallet(userId: string) {
    return prisma.wallet.findUnique({
      where: {
        userId,
      },
    });
  }

  async update(userId: string, data: any) {
    return prisma.wallet.update({
      where: {
        userId,
      },
      data,
    });
  }
}
