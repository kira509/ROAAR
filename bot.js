const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const fs = require("fs");
const qrcode = require("qrcode-terminal");

let sock;
let connected = false;

async function startSocket() {
  if (sock && connected) return "✅ Already connected.";

  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: true, // ✅ Print QR in logs
    browser: ["GenesisBot", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("📸 Scan this QR to login:");
      qrcode.generate(qr, { small: true });
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

  return "📸 Scan the QR in logs.";
}

function isConnected() {
  return connected;
}

module.exports = { startSocket, isConnected };
