import express from "express";
import startSocket from "./bot.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("<h1>Genesis ROOAR Bot is Running!</h1>");
});

app.listen(PORT, () => {
  console.log(`🌐 Express server running at http://localhost:${PORT}`);
  startSocket(); // start the bot
});
