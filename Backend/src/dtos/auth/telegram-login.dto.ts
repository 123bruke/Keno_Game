import { z } from "zod";
import { Role } from "@prisma/client";

export const TelegramLoginSchema = z.object({
  telegramId: z.coerce.bigint(),
  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  initData: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
});

export type TelegramLoginDto = z.infer<typeof TelegramLoginSchema>;
