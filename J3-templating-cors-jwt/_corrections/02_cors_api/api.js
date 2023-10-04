import express from "express";
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();

const app = express();

app.get("/c", (req, res) => {
  const users = [
    { name: "Leanne Graham b" },
    { name: "Ervin Howell b" },
    { name: "Clementine Bauch b" },
    { name: "Patricia Lebsack b" },
  ];
  res.json({ users });
});

app.listen(process.env.API_PORT, () => {
  console.log(`API ready on : http://${process.env.API_HOST}:${process.env.API_PORT}`);
});
