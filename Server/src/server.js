import "./config/env.js";
import app from "./app.js";
import { info } from "./utils/logger.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  info(`🚀 Server running on http://localhost:${PORT}`);
});