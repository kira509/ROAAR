const express = require("express");
const { startSocket, isConnected, getQrSvg } = require("./bot");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🌍 GenesisBot is live");
});

app.get("/status", (req, res) => {
  res.send(isConnected() ? "✅ Bot is connected to WhatsApp!" : "❌ Bot not connected.");
});

// ⚡ Auto-start bot when visiting /qr
app.get("/qr", async (req, res) => {
  if (!isConnected()) await startSocket();

  const svg = await getQrSvg();
  if (!svg) {
    return res.send(`
      <body style="background:#111;color:white;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh">
        <div>
          <h2>⏳ Waiting for QR code...</h2>
          <p>Refresh this page after a few seconds.</p>
        </div>
      </body>
    `);
  }

  res.send(`
    <body style="background:#111;color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif">
      <h2>📸 Scan QR Code to Login</h2>
      <div style="background:white;padding:20px;border-radius:12px;margin-top:20px">
        ${svg}
      </div>
    </body>
  `);
});

app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
