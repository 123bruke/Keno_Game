import { WalletRepository } from "../repositories/wallet.repository";

export class WalletService {
  private walletRepository = new WalletRepository();

  async getWallet(userId: string) {
    const wallet = await this.walletRepository.getWallet(userId);

    return wallet;
  }
}
