const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const puppeteer = require("puppeteer");

// ✅ Puppeteer override (Render/Heroku safe)
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
  if (sock) {
    console.log("✅ Already paired or running");
    return "Already paired or running";
  }

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

  try {
    const code = await sock.requestPairingCode("+254738701209");
    console.log("🔗 Pair code:", code);
    return code;
  } catch (err) {
    console.error("❌ Bot failed to start:", err);
    return null;
  }
}

function isConnected() {
  return !!sock?.user;
}

module.exports = { startSocket, isConnected };
