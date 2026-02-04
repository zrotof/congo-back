const { cloudinary } = require('../config/cloudinary-config');

const imageService = {

  /**
   * Upload image pour Challenge (originale + floue)
   */
  uploadChallengeImage: async (file, folder) => {
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    const originalResult = await cloudinary.uploader.upload(dataUrl, {
      folder: `${folder}/original`,
      resource_type: 'image'
    });

    const blurredResult = await cloudinary.uploader.upload(dataUrl, {
      folder: `${folder}/blurred`,
      resource_type: 'image',
      transformation: [
        { effect: 'blur:2000' },
        { quality: 'auto:low' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      originalUrl: originalResult.secure_url,
      blurredUrl: blurredResult.secure_url
    };
  },

  /**
   * Upload image simple (pour les filtres Snapchat)
   */
  uploadFilterImage: async (file, folder) => {
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { width: 500, height: 500, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return result.secure_url;
  },

  /**
   * Supprime une image
   */
  deleteImage: async (imageUrl) => {
    if (!imageUrl) return;

    try {
      const urlParts = imageUrl.split('/');
      const fileNameWithExt = urlParts.pop();
      const fileName = fileNameWithExt.split('.')[0];
      const folderParts = urlParts.slice(urlParts.indexOf('upload') + 2);
      const publicId = [...folderParts, fileName].join('/');

      await cloudinary.uploader.destroy(publicId);
      console.log(`🗑️ Image supprimée: ${publicId}`);
    } catch (error) {
      console.error('Erreur suppression image:', error.message);
    }
  }
};

module.exports = imageService;