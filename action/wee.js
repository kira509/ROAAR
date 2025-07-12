const ytdl = require("ytdl-core");
const yts = require("yt-search");

// ✅ YouTube Search
const searchYouTube = async (query) => {
    const results = await yts(query);
    return results.videos.length > 0 ? results.videos[0] : null;
};

// ✅ YouTube Download
const downloadYouTube = async (url) => {
    if (!ytdl.validateURL(url)) throw "Invalid YouTube URL!";
    
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
    
    return {
        title: info.videoDetails.title,
        thumbnail: info.videoDetails.thumbnails.pop().url,
        audioUrl: format.url,
        duration: info.videoDetails.lengthSeconds,
        author: info.videoDetails.author.name
    };
};

// (Optional) Dummy SoundCloud & Spotify placeholders
const searchSpotify = async (query) => {
    return { title: "Fake Spotify Result", query };
};
const downloadSoundCloud = async (url) => {
    return { audioUrl: "https://fake.soundcloud.link", url };
};

module.exports = {
    searchYouTube,
    downloadYouTube,
    searchSpotify,
    downloadSoundCloud
};
