import { Router } from "express";
import { WalletController } from "../controllers/wallet.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

const controller = new WalletController();

router.get("/wallet", authenticate, controller.getWallet);

export default router;
