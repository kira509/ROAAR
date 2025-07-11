const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')

/**
 * Uploads a file to telegra.ph
 */
async function uploadToTelegraPh(filePath) {
  if (!fs.existsSync(filePath)) throw new Error('File not found')
  try {
    const form = new FormData()
    form.append('file', fs.createReadStream(filePath))
    const res = await axios.post('https://telegra.ph/upload', form, {
      headers: form.getHeaders()
    })
    return 'https://telegra.ph' + res.data[0].src
  } catch (err) {
    throw new Error(`TelegraPh Upload Failed: ${err.message}`)
  }
}

/**
 * Uploads a file to uguu.se
 */
async function uploadToUguu(filePath) {
  if (!fs.existsSync(filePath)) throw new Error('File not found')
  try {
    const form = new FormData()
    form.append('files[]', fs.createReadStream(filePath))
    const res = await axios.post('https://uguu.se/upload.php', form, {
      headers: {
        ...form.getHeaders(),
        'User-Agent': 'Mozilla/5.0 (GenesisBot)'
      }
    })
    return res.data.files[0]
  } catch (err) {
    throw new Error(`Uguu Upload Failed: ${err.message}`)
  }
}

/**
 * Converts WebP to MP4 - Deprecated Method (ezgif.com scraping)
 * Recommend using ffmpeg locally instead.
 */
async function webpToMp4(filePath) {
  throw new Error('webpToMp4() via ezgif has been disabled for security reasons. Use local FFmpeg instead.')
  // If you want to enable it, let me know and I’ll restore with safer fallback logic
}

module.exports = {
  uploadToTelegraPh,
  uploadToUguu,
  webpToMp4 // placeholder only
}
