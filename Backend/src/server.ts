import dotenv from "dotenv";
import { startGameScheduler } from "./scheduler/game.scheduler";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port: http://localhost:${PORT}`);

  startGameScheduler();
});
