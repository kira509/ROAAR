// Safe dummy authenticationn() that does nothing
async function authenticationn() {
  console.log("🛡️ Custom auth() bypassed. Using manual QR/pair code login.");
}
module.exports = authenticationn;
