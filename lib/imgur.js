// imgur.js
const pkg = require('imgur');
const fs = require('fs');
require('dotenv').config();

const { ImgurClient } = pkg;
const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID });

async function uploadtoimgur(imagepath) {
  try {
    const response = await client.upload({
      image: fs.createReadStream(imagepath),
      type: 'stream',
    });
    let url = response.data.link;
    console.log(url);
    return url;
  } catch (error) {
    console.error('An error occurred during upload:', error);
    throw error;
  }
}

module.exports = uploadtoimgur;
