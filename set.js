/* If you're using a panel, carefully edit this part.
No need to configure this if deploying via Heroku or Render — just set them as environment variables.
*/

const sessionName = 'session';
const session = process.env.SESSION || '';
const autobio = process.env.AUTOBIO || 'FALSE';
const autolike = process.env.AUTOLIKE_STATUS || 'TRUE';
const autoviewstatus = process.env.AUTOVIEW_STATUS || 'TRUE';
const welcomegoodbye = process.env.WELCOMEGOODBYE || 'FALSE';
const prefix = process.env.PREFIX || '.';
const appname = process.env.APP_NAME || 'GENESIS BOT';
const herokuapi = process.env.HEROKU_API;
const gptdm = process.env.GPT_INBOX || 'TRUE';
const mode = process.env.MODE || 'PUBLIC';
const anticall = process.env.AUTOREJECT_CALL || 'TRUE';
const botname = process.env.BOTNAME || '𝗚𝗘𝗡𝗘𝗦𝗜𝗦-𝗕𝗢𝗧';
const antibot = process.env.ANTIBOT || 'FALSE';
const author = process.env.STICKER_AUTHOR || '𝗚𝗘𝗡𝗘𝗦𝗜𝗦';
const packname = process.env.STICKER_PACKNAME || '𝗚𝗘𝗡𝗘𝗦𝗜𝗦';
const antitag = process.env.ANTITAG || 'TRUE';
const dev = process.env.DEV || '254738701209';
const owner = dev.split(",");
const menulink = process.env.MENU_LINK || 'https://github.com/kira509/ROOAR/blob/main/Media/Genesis.jpg?raw=true';
const menu = process.env.MENU_TYPE || 'IMAGE';
const badwordkick = process.env.BAD_WORD_KICK || 'FALSE';
const bad = process.env.BAD_WORD || 'fuck';
const autoread = process.env.AUTOREAD || 'TRUE';
const antidel = process.env.ANTIDELETE || 'TRUE';
const admin = process.env.ADMIN_MSG || '🚫 This command is reserved for *Admins*!';
const group = process.env.GROUP_ONLY_MSG || '👥 This command is for *Groups* only!';
const botAdmin = process.env.BOT_ADMIN_MSG || '🛠️ I need *Admin privileges*!';
const NotOwner = process.env.NOT_OWNER_MSG || '👑 This command is for the *Owner* only!';
const wapresence = process.env.WA_PRESENCE || 'recording';
const antilink = process.env.ANTILINK || 'TRUE';
const mycode = process.env.CODE || '254';
const antiforeign = process.env.ANTIFOREIGN || 'TRUE';
const port = process.env.PORT || 8080;
const antilinkall = process.env.ANTILINK_ALL || 'TRUE';

module.exports = {
  session, sessionName, autobio, author, packname, dev, owner,
  badwordkick, bad, mode, group, NotOwner, botname, botAdmin,
  antiforeign, menu, menulink, autoread, antilink, admin, mycode,
  antilinkall, anticall, antitag, antidel, wapresence,
  welcomegoodbye, antibot, herokuapi, prefix, port, gptdm,
  appname, autolike, autoviewstatus
};
