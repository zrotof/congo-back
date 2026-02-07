const { models } = require('../models');

const filterService = {

  getAll: async () => {
    return await models.Filter.findAll({
      order: [['createdAt', 'DESC']]
    });
  },

  getActive: async () => {
    return await models.Filter.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
  },

  getById: async (id) => {
    const filter = await models.Filter.findByPk(id);
    if (!filter) throw new Error('Filtre non trouvé');
    return filter;
  },

  create: async (data) => {
    return await models.Filter.create({
      name: data.name || null,
      imageUrl: data.imageUrl,
      filterUrl: data.filterUrl,
      platform: data.platform || 'SNAPCHAT',
      usageCount: 0,
      isActive: data.isActive === 'true' || data.isActive === true
    });
  },

  update: async (id, data, imageUrl = null) => {
    const filter = await models.Filter.findByPk(id);
    if (!filter) throw new Error('Filtre non trouvé');

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.filterUrl !== undefined) updateData.filterUrl = data.filterUrl;
    if (data.platform !== undefined) updateData.platform = data.platform;
    
    // Gestion booléenne propre pour isActive
    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive === 'true' || data.isActive === true;
    }

    if (imageUrl) updateData.imageUrl = imageUrl;

    await filter.update(updateData);
    return filter;
  },

  delete: async (id) => {
    const filter = await models.Filter.findByPk(id);
    if (!filter) throw new Error('Filtre non trouvé');
    await filter.destroy();
    return filter;
  }
};

module.exports = filterService;