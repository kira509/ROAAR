import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import P from "pino";

const startSocket = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('./auth'); // session folder
  const sock = makeWASocket({
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
    browser: ["Havoc", "Chrome", "4.0"],
    auth: state
  });

  // Event: connection update
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

      if (reason === DisconnectReason.loggedOut) {
        console.log("❌ Logged out. Rebooting...");
        startSocket(); // restart
      } else {
        console.log("📴 Connection closed. Reason:", reason);
      }
    }

    if (connection === "open") {
      console.log("✅ Connected to WhatsApp!");
    }
  });

  // Event: creds update (save session)
  sock.ev.on("creds.update", saveCreds);

  // Smart pairing check
  if (!sock.authState.creds.registered) {
    try {
      const code = await sock.requestPairingCode("254738701209");
      console.log("🔗 Pair this device using code:", code);
    } catch (err) {
      console.error("❌ Pairing failed:", err.message);
    }
  } else {
    console.log("✅ Already paired or running");
  }

  return sock;
};

export default startSocket;
