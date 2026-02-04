const { models } = require('../models');

const challengeService = {

  getAll: async () => {
    return await models.Challenge.findAll({
      order: [['createdAt', 'DESC']]
    });
  },

  getActive: async () => {
    return await models.Challenge.findOne({
      where: { isActive: true }
    });
  },

  getById: async (id) => {
    const challenge = await models.Challenge.findByPk(id);
    if (!challenge) {
      throw new Error('Challenge non trouvé');
    }
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
    if (!challenge) {
      throw new Error('Challenge non trouvé');
    }

    const updateData = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.contextText !== undefined) updateData.contextText = data.contextText;
    if (data.targetViews !== undefined) updateData.targetViews = parseInt(data.targetViews);

    updateData.isActive = data.isActive === 'true';

    if (imageUrls) {
      updateData.imageUrl = imageUrls.originalUrl;
      updateData.blurredImageUrl = imageUrls.blurredUrl;
    }

    await challenge.update(updateData);
    return challenge;
  },

  activate: async (id) => {
    await models.Challenge.update(
      { isActive: false },
      { where: {} }
    );

    const challenge = await models.Challenge.findByPk(id);
    if (!challenge) {
      throw new Error('Challenge non trouvé');
    }

    await challenge.update({ isActive: true });
    return challenge;
  },

  deactivate: async (id) => {
    const challenge = await models.Challenge.findByPk(id);
    if (!challenge) {
      throw new Error('Challenge non trouvé');
    }

    await challenge.update({ isActive: false });
    return challenge;
  },

  delete: async (id) => {
    const challenge = await models.Challenge.findByPk(id);
    if (!challenge) {
      throw new Error('Challenge non trouvé');
    }
    await challenge.destroy();
    return true;
  }
};

module.exports = challengeService;