import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import route from "./routes/routes.js";

// ==========
// App initialization
// ==========

dotenv.config();
const HOSTNAME = process.env.APP_HOSTNAME;
const PORT = process.env.APP_PORT;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// ==========
// App middlewares
// ==========

app.use(express.static(path.join(__dirname, "public")));

// ==========
// App routers
// ==========

app.use("/", route);

// ==========
// App start
// ==========

app.listen(PORT, () => {
  console.log(`App listening at http://${HOSTNAME}:${PORT}`);
});
