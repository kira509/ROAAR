const express = require("express");
const { startSocket, isConnected } = require("./bot");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🌍 GenesisBot is running smoothly");
});

app.get("/pair", async (req, res) => {
  const code = await startSocket();
  res.send(`
    <body style="background:#111;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif">
      <div style="text-align:center">
        <h3>🔗 Your GenesisBot Pair Code</h3>
        <h1 style="font-size:4em">${code || "❌ Error: Already paired or failed"}</h1>
        <p style="margin-top:1em;">Enter this in WhatsApp → Link Device → Use Pair Code</p>
      </div>
    </body>
  `);
});

app.get("/status", (req, res) => {
  res.send(isConnected() ? "✅ Bot is connected!" : "❌ Bot not connected.");
});

app.listen(PORT, () => {
  console.log(`🌐 GenesisBot server running → http://localhost:${PORT}`);
});
