const express = require("express");
const { startSocket, isConnected } = require("./bot");
const app = express();

const PORT = process.env.PORT || 3000;
let pairCode = null;

app.get("/", (req, res) => {
  res.send("🌍 GenesisBot is live");
});

// 🔒 Manually trigger pair code
app.get("/generate", async (req, res) => {
  if (isConnected()) {
    return res.json({ status: "connected" });
  }
  pairCode = await startSocket();
  res.json({ code: pairCode || null });
});

// 🔓 View pair code (after /generate)
app.get("/pair", (req, res) => {
  res.send(`
    <body style="background:#0d0d0d;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif">
      <h2>🔗 WhatsApp Pair Code</h2>
      <h1 id="code" style="font-size:3em;">${pairCode || "❌ No code yet"}</h1>
      <p>Use this in WhatsApp &gt; Link Device &gt; Enter Code</p>
      <button onclick="generateCode()" style="padding:10px 20px;font-size:16px;margin-top:20px;background:#4CAF50;border:none;color:white;border-radius:8px;">Get Pair Code</button>
      <script>
        async function generateCode() {
          const res = await fetch('/generate');
          const data = await res.json();
          if (data.status === 'connected') {
            document.getElementById('code').innerText = '✅ Already Connected';
          } else if (data.code) {
            document.getElementById('code').innerText = data.code;
          } else {
            document.getElementById('code').innerText = '❌ Failed to generate';
          }
        }
      </script>
    </body>
  `);
});

app.get("/status", (req, res) => {
  res.send(isConnected() ? "✅ Bot is connected to WhatsApp!" : "❌ Bot not connected.");
});

app.listen(PORT, () =>
  console.log(`🌐 Express server running at http://localhost:${PORT}`)
);
