/*
 * Uploads an image buffer to ImageKit and returns the public URL
 * @param {Buffer} fileBuffer - The image file buffer
 * @param {string} fileName - The desired file name for the uploaded image
 * @returns {Promise<string>} - The public URL of the uploaded image
*/

const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL,
});


async function uploadToCloud(fileBuffer, fileName) {
  try {
    // Convert buffer to base64 string
    const base64String = fileBuffer.toString('base64');

    const result = await imagekit.upload({
      file: base64String,
      fileName,
    });

    return result.url;

  }
  
  catch (error) {
    console.error('Error uploading to ImageKit:', error);
    throw error;
  }
}

module.exports = uploadToCloud;
