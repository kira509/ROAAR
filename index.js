const { Client } = require("whatsapp-web.js");
const express = require("express");
const fs = require("fs");
const qrcode = require("qrcode");

const SESSION_FILE_PATH = "./session.json";
let sessionData;

if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  authStrategy: sessionData
    ? undefined
    : undefined,
});

client.on("qr", async (qr) => {
  console.log("⚠️ Pair Code (Scan or Render It)");
  qrcode.toString(qr, { type: "terminal" }, (err, url) => {
    console.log(url);
  });
});

client.on("authenticated", (session) => {
  console.log("✅ Authenticated");
  fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
});

client.on("ready", () => {
  console.log("🎉 GenesisBot is ready!");
});

client.on("message", async (msg) => {
  if (msg.body.toLowerCase() === "!ping") {
    await msg.reply("🏓 Pong from GenesisBot!");
  }
});

client.initialize();

// Keep-alive server for Render
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("GenesisBot is alive!"));
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));

