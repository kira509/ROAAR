const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const puppeteer = require("puppeteer");

// Puppeteer Safe Docker Flags
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

let sock = null;
let connected = false;
let pairCode = null;
let fetchingCode = false;

async function startSocket() {
  if (sock && connected) return pairCode;

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

    if (connection === "open") {
      connected = true;
      pairCode = null;
      fetchingCode = false;
      console.log("✅ GenesisBot connected to WhatsApp!");
    }

    if (connection === "close") {
      connected = false;
      const reason = lastDisconnect?.error?.output?.statusCode;
      console.log("❌ Disconnected. Reconnect?", reason !== DisconnectReason.loggedOut);
      sock = null;
      if (reason !== DisconnectReason.loggedOut) {
        await startSocket();
      }
    }
  });

  // Delay before requesting the pair code
  await new Promise((res) => setTimeout(res, 2000));

  if (!connected && !fetchingCode) {
    fetchingCode = true;
    try {
      pairCode = await sock.requestPairingCode("+254738701209");
      console.log("🔗 Pair code:", pairCode);
      return pairCode;
    } catch (err) {
      console.error("❌ Failed to get pair code:", err);
      return null;
    }
  } else {
    return pairCode;
  }
}

function isConnected() {
  return connected;
}

module.exports = { startSocket, isConnected };
