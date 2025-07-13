const express = require("express");
const { startSocket, isConnected } = require("./bot");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🌍 GenesisBot is live");
});

app.get("/pair", async (req, res) => {
  const code = await startSocket();
  res.send(`
    <body style="background:#111;color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif">
      <div>
        <h3>🔗 Your WhatsApp Pair Code</h3>
        <h1>${code || "❌ Error: Already paired or failed to connect"}</h1>
        <p>Enter this in WhatsApp &gt; Link Device &gt; Use Pair Code</p>
      </div>
    </body>
  `);
});

app.get("/status", (req, res) => {
  res.send(isConnected() ? "✅ Bot is connected to WhatsApp!" : "❌ Bot not connected.");
});

app.listen(PORT, () =>
  console.log(`🌐 Express server running at http://localhost:${PORT}`)
);
