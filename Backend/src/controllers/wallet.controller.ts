import { Request, Response } from "express";
import { WalletService } from "../services/wallet.service";
import { success } from "../utils/response";

export class WalletController {
  private walletService = new WalletService();

  getWallet = async (req: Request, res: Response) => {
    const wallet = await this.walletService.getWallet(req.user!.userId);

    return success(res, wallet);
  };
}
