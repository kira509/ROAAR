// --- RENDER KEEP-ALIVE HTTP SERVER ---
const http = require('http');
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  if (req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' }).end('OK');
  } else {
    res.writeHead(404).end('Not Found');
  }
}).listen(PORT, () => {
  console.log(`🌐 HTTP server running on port ${PORT}`);
});

// --- GENESISBOT CORE ---
const { Boom } = require("@hapi/boom");
const makeWASocket = require("@whiskeysockets/baileys").default;
const {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const path = require("path");

const startGenesisBot = async () => {
    const { version, isLatest } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState("auth");

    const sock = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: true,
        auth: state,
        browser: ["GenesisBot", "Chrome", "1.0.0"],
        version,
    });

    // connection status
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "close") {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log("❌ Connection closed. Reconnecting: ", shouldReconnect);

            if (shouldReconnect) {
                startGenesisBot();
            }
        } else if (connection === "open") {
            console.log("✅ GenesisBot is now connected!");
        }
    });

    // listen for messages
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        if (type !== "notify") return;
        const msg = messages[0];
        if (!msg.message) return;

        const sender = msg.key.remoteJid;
        const messageText = msg.message.conversation || msg.message.extendedTextMessage?.text;

        console.log(`📩 Message from ${sender}: ${messageText}`);

        if (messageText === "!ping") {
            await sock.sendMessage(sender, { text: "🏓 Pong!" });
        }
    });

    // save session credentials
    sock.ev.on("creds.update", saveCreds);
};

startGenesisBot();

