import dotenv from "dotenv";
import app from "./app.js";
import { info } from "./utils/logger.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  info(`🚀 Server running on http://localhost:${PORT}`);
});