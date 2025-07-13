const express = require("express");
const { startSocket, isConnected } = require("./bot");
const app = express();

const PORT = process.env.PORT || 3000;
let lastPairCode = null;

app.get("/", (req, res) => {
  res.send("🌍 GenesisBot is live.");
});

app.get("/status", (req, res) => {
  res.send(isConnected() ? "✅ Bot is connected to WhatsApp!" : "❌ Bot not connected.");
});

// 👇 GET: Generate new pair code manually
app.get("/generate", async (req, res) => {
  if (isConnected()) {
    return res.json({ status: "connected", code: "Already Connected" });
  }
  const code = await startSocket();
  if (code) lastPairCode = code;
  res.json({ status: code ? "ok" : "error", code: code || null });
});

// 👁️ View current pair code
app.get("/pair", (req, res) => {
  res.send(`
    <body style="background:#0d0d0d;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;text-align:center">
      <h2>🔗 WhatsApp Pair Code</h2>
      <h1 id="code" style="font-size:3em;">${lastPairCode || "❌ No code yet"}</h1>
      <p>Use this in WhatsApp > Link Device > Use Pair Code</p>
      <button onclick="getCode()" style="margin-top:20px;padding:10px 20px;font-size:16px;background:#4CAF50;border:none;color:white;border-radius:6px;">Generate New Code</button>
      <script>
        async function getCode() {
          const res = await fetch('/generate');
          const data = await res.json();
          document.getElementById('code').innerText = data.code || "❌ Failed to fetch code";
        }
      </script>
    </body>
  `);
});

app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
});
