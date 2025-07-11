const welcomegoodbye = process.env.WELCOMEGOODBYE || "TRUE";
const botname = process.env.BOTNAME || "GENESIS-BOT";

const Events = async (client, update) => {
  try {
    const metadata = await client.groupMetadata(update.id);
    const participants = update.participants;
    const description = metadata.desc || "No Description";
    const total = metadata.participants.length;

    for (let user of participants) {
      let profilePic;
      try {
        profilePic = await client.profilePictureUrl(user, 'image');
      } catch {
        profilePic = "https://telegra.ph/file/265c672094dfa87caea19.jpg"; // safe fallback image
      }

      if (update.action === 'add') {
        let caption = `@${user.split('@')[0]} 👋\n\nWelcome to ${metadata.subject}.\n\n📄 ${description}\n\n👥 Total: ${total}\n\nBOT: ${botname}`;
        if (welcomegoodbye === "TRUE") {
          await client.sendMessage(update.id, {
            image: { url: profilePic },
            caption,
            mentions: [user]
          });
        }
      } else if (update.action === 'remove') {
        let caption = `@${user.split('@')[0]} 👋\n\nHas left or been removed.\n\nBOT: ${botname}`;
        if (welcomegoodbye === "TRUE") {
          await client.sendMessage(update.id, {
            image: { url: profilePic },
            caption,
            mentions: [user]
          });
        }
      }
    }
  } catch (err) {
    console.log("Group event error:", err);
  }
};

module.exports = Events;
