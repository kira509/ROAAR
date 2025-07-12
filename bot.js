const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const puppeteer = require("puppeteer");

// ✅ Puppeteer override with Docker-safe args
globalThis.puppeteer = puppeteer;
puppeteer.launch = (options = {}) =>
  require("puppeteer").launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
    ...options,
  });

let sock;

async function startSocket() {
  if (sock) return "Already paired or running";

  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: false,
    browser: ["GenesisBot", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("❌ Disconnected. Reconnecting:", shouldReconnect);
      if (shouldReconnect) {
        sock = null;
        await startSocket();
      }
    }

    if (connection === "open") {
      console.log("✅ GenesisBot connected!");
    }
  });

  // ✅ Wait for WebSocket to be ready
  await new Promise((resolve) => {
    const waitSocket = setInterval(() => {
      if (sock.ws && sock.ws.readyState === 1) {
        clearInterval(waitSocket);
        resolve();
      }
    }, 500);
  });

  const code = await sock.requestPairingCode("+254738701209");
  console.log("🔗 Pair code:", code);
  return code;
}

module.exports = { startSocket };
