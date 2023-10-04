import express from "express";
import dotenv from "dotenv";
import path from 'node:path'
import { fileURLToPath } from 'node:url'

dotenv.config();

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  const home = path.join(__dirname, "views", "home.html")
  res.sendFile(home);
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`SERVER ready on : http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
});
