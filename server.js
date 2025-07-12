const express = require("express");
const { startSocket } = require("./bot");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ GenesisBot Express server is live.");
});

app.get("/pair", async (req, res) => {
  try {
    const code = await startSocket();
    res.send(`
      <html>
        <body style="text-align:center;font-family:sans-serif;margin-top:20%;">
          <h2>🔗 Your WhatsApp Pair Code</h2>
          <h1 style="font-size:3rem">${code}</h1>
          <p>Enter this in WhatsApp > Link Device > Use Pair Code</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("❌ Pair code error:", err);
    res.status(500).send("Failed to generate pair code");
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Express server running at http://localhost:${PORT}`);
});
