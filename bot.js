const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const QRCode = require("qrcode");

let sock;
let connected = false;
let lastQr = null;

async function startSocket() {
  if (sock && connected) return "✅ Already connected.";

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
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      lastQr = qr;
      console.log("📸 New QR code received.");
    }

    if (connection === "open") {
      connected = true;
      console.log("✅ GenesisBot connected!");
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

  return "📸 Scan the QR at /qr route";
}

function isConnected() {
  return connected;
}

async function getQrSvg() {
  if (!lastQr) return null;
  return await QRCode.toString(lastQr, { type: "svg" });
}

module.exports = { startSocket, isConnected, getQrSvg };
