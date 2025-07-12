const express = require("express");
const { startSocket } = require("./bot");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <html>
      <body style="text-align:center;margin-top:20%;font-family:sans-serif">
        <h1>✅ GenesisBot Server Live</h1>
        <p>Click below to generate a WhatsApp pair code:</p>
        <a href="/pair" style="font-size:2rem;">➡️ Get Pair Code</a>
      </body>
    </html>
  `);
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

// ❌ Removed: Automatic startSocket() call on boot

app.listen(PORT, () => {
  console.log(`🌐 Express server running at http://localhost:${PORT}`);
});
