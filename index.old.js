// --- RENDER KEEP-ALIVE HTTP SERVER ---
//const http = require('http');
//const PORT = process.env.PORT || 3000;

//http.createServer((req, res) => {
 // if (req.url === '/healthz') {
 //   res.writeHead(200, { 'Content-Type': 'text/plain' }).end('OK');
//  } else {
//    res.writeHead(404).end('Not Found');
//  }
//}).listen(PORT, () => {
//  console.log(`🌐 HTTP server running on port ${PORT}`);
//});

// --- GENESISBOT CORE ---
//const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
//const pino = require("pino");

//const startGenesisBot = async () => {
   // const { state, saveCreds } = await useMultiFileAuthState("auth");
   // const { version } = await fetchLatestBaileysVersion();

  //  const sock = makeWASocket({
   //     version,
      //  logger: pino({ level: "silent" }),
      //  auth: state,
     //   browser: ["GenesisBot", "Chrome", "1.0.0"]
   // });

  //  sock.ev.on("connection.update", async (update) => {
      //  const { connection, lastDisconnect, pairingCode } = update;

      //  if (pairingCode) {
         //   console.log(`🔑 Pair Code: ${pairingCode}`);
         //   console.log("ℹ️  Enter the code in WhatsApp: Link with Phone Number > Use Pair Code");
     //   }

     //   if (connection === "close") {
    //        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
    //        console.log("❌ Connection closed. Reconnecting:", shouldReconnect);
     //       if (shouldReconnect) startGenesisBot();
    //    }
//
  //      if (connection === "open") {
     //       console.log("✅ GenesisBot is now connected!");
     //   }
    //});

   // sock.ev.on("creds.update", saveCreds)};

//startGenesisBot();
