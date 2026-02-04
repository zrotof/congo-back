const { models } = require('../models');

const snapFilterService = {

  /**
   * Récupère tous les filtres
   */
  getAll: async () => {
    return await models.SnapFilter.findAll({
      order: [['createdAt', 'DESC']]
    });
  },

  /**
   * Récupère les filtres actifs
   */
  getActive: async () => {
    return await models.SnapFilter.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
  },

  /**
   * Récupère un filtre par ID
   */
  getById: async (id) => {
    const filter = await models.SnapFilter.findByPk(id);
    if (!filter) {
      throw new Error('Filtre non trouvé');
    }
    return filter;
  },

  /**
   * Crée un nouveau filtre
   */
  create: async (data) => {
    return await models.SnapFilter.create({
      name: data.name || null,
      imageUrl: data.imageUrl || null,
      snapchatUrl: data.snapchatUrl,
      usageCount: 0,
      isActive: data.isActive === 'true' || data.isActive === true
    });
  },

  /**
   * Met à jour un filtre
   */
  update: async (id, data, imageUrl = null) => {
    const filter = await models.SnapFilter.findByPk(id);
    if (!filter) {
      throw new Error('Filtre non trouvé');
    }

    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.snapchatUrl !== undefined) updateData.snapchatUrl = data.snapchatUrl;
    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive === 'true' || data.isActive === true;
    }

    // Mise à jour de l'image si fournie
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    await filter.update(updateData);
    return filter;
  },

  /**
   * Supprime un filtre
   */
  delete: async (id) => {
    const filter = await models.SnapFilter.findByPk(id);
    if (!filter) {
      throw new Error('Filtre non trouvé');
    }
    await filter.destroy();
    return true;
  }
};

module.exports = snapFilterService;