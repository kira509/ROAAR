const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const pino = require("pino");

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
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
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

  const code = await sock.requestPairingCode("+254738701209");
  console.log("🔗 Pair code:", code);
  return code;
}

module.exports = { startSocket };
