const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const qrcode = require("qrcode");

let sock;
let connected = false;
let qrData = null;

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
      qrData = await qrcode.toString(qr, { type: "svg" }); // ✅ Convert QR to SVG string
      console.log("📸 QR code generated. Visit /qr to scan it.");
    }

    if (connection === "open") {
      connected = true;
      qrData = null;
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

  return "📸 Waiting for QR scan";
}

function isConnected() {
  return connected;
}

function getQrSvg() {
  return qrData;
}

module.exports = { startSocket, isConnected, getQrSvg };
