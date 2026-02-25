const { models } = require('../models');
const challengeCounterService = require('./challenge-counter.service');

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
    // Si on crée un challenge actif, on doit désactiver les autres
    if (data.isActive === 'true' || data.isActive === true) {
      await models.Challenge.update({ isActive: false }, { where: {} });
    }

    const challenge = await models.Challenge.create({
      title: data.title,
      contextText: data.contextText || null,
      imageUrl: data.imageUrl || null,
      blurredImageUrl: data.blurredImageUrl || null,
      targetViews: parseInt(data.targetViews) || 1000,
      currentViews: 0,
      isActive: data.isActive === 'true' || data.isActive === true
    });

    // Mise à jour immédiate de la RAM si actif
    if (challenge.isActive) {
      await challengeCounterService.load(challenge.id);
    }

    return challenge;
  },

  update: async (id, data, imageUrls = null) => {
    const challenge = await models.Challenge.findByPk(id);
    if (!challenge) throw new Error('Challenge non trouvé');

    const updateData = {};
    // ... (title, contextText, targetViews inchangés) ...

    // Gestion de l'activation
    if (data.isActive !== undefined) {
      const isActive = data.isActive === 'true' || data.isActive === true;
      updateData.isActive = isActive;

      if (isActive) {
        // Désactiver TOUS les autres
        await models.Challenge.update({ isActive: false }, { where: {} });
      }
    }

    if (imageUrls) {
      updateData.imageUrl = imageUrls.originalUrl;
      updateData.blurredImageUrl = imageUrls.blurredUrl;
    }

    await challenge.update(updateData);

    // Mise à jour de la RAM
    if (challenge.isActive) {
      challengeCounterService.unload(); // Vider l'ancien
      await challengeCounterService.load(challenge.id); // Charger le nouveau
    } else {
      // Si on vient de le désactiver
      challengeCounterService.unload();
    }

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