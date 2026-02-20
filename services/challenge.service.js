const { models } = require('../models');

const challengeService = {

  /**
   * Récupère le challenge actif pour l'API publique
   */
  getActive: async () => {
    return await models.Challenge.findOne({
      where: { isActive: true },
      attributes: [
        'id', 'title', 'contextText', 'blurredImageUrl', 'targetViews', 'currentViews', 'imageUrl' // On a besoin de l'original aussi pour la logique de reveal
      ]
    });
  },

  getAll: async () => {
    return await models.Challenge.findAll({
      order: [['createdAt', 'DESC']]
    });
  },

  getById: async (id) => {
    const challenge = await models.Challenge.findByPk(id);
    if (!challenge) throw new Error('Challenge non trouvé');
    return challenge;
  },

  create: async (data) => {
    return await models.Challenge.create({
      title: data.title,
      contextText: data.contextText || null,
      imageUrl: data.imageUrl || null,
      blurredImageUrl: data.blurredImageUrl || null,
      targetViews: parseInt(data.targetViews) || 1000,
      currentViews: 0,
      isActive: data.isActive
    });
  },

  update: async (id, data, imageUrls = null) => {
    const challenge = await models.Challenge.findByPk(id);
    if (!challenge) throw new Error('Challenge non trouvé');

    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.contextText !== undefined) updateData.contextText = data.contextText;
    if (data.targetViews !== undefined) updateData.targetViews = parseInt(data.targetViews);

    if (data?.isActive) {
      updateData.isActive = data.isActive;
    }

    if (imageUrls) {
      updateData.imageUrl = imageUrls.originalUrl;
      updateData.blurredImageUrl = imageUrls.blurredUrl;
    }

    await challenge.update(updateData);
    return challenge;
  },

  delete: async (id) => {
    const challenge = await models.Challenge.findByPk(id);
    if (!challenge) throw new Error('Challenge non trouvé');
    await challenge.destroy();
    return challenge;
  }
};

module.exports = challengeService;