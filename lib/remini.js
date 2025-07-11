const FormData = require("form-data");

/**
 * Enhance or filter an image using Vyro.ai's inference engine
 * @param {Buffer} imageBuffer - The image as a Buffer (JPEG only)
 * @param {string} type - One of: "enhance", "recolor", or "dehaze"
 * @returns {Promise<Buffer>} - Returns the processed image buffer
 */
async function remini(imageBuffer, type = 'enhance') {
  return new Promise((resolve, reject) => {
    const allowedTypes = ['enhance', 'recolor', 'dehaze'];
    const selectedType = allowedTypes.includes(type) ? type : 'enhance';

    const form = new FormData();
    const endpoint = `https://inferenceengine.vyro.ai/${selectedType}`;

    form.append('model_version', 1);
    form.append('image', imageBuffer, {
      filename: 'genesis-enhanced.jpg',
      contentType: 'image/jpeg'
    });

    form.submit({
      protocol: 'https:',
      host: 'inferenceengine.vyro.ai',
      path: `/${selectedType}`,
      method: 'POST',
      headers: {
        'User-Agent': 'GenesisBot/1.0',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
        ...form.getHeaders()
      }
    }, (err, res) => {
      if (err || !res) return reject(new Error("Remini submission failed"));

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
  });
}

module.exports = { remini };
