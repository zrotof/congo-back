const { models } = require('../models');

let filterCounters = {};

const filterCounterService = {

  init: async () => {
    try {
      const filters = await models.Filter.findAll({ where: { isActive: true } }); // ✅ models.Filter
      filters.forEach(f => { filterCounters[f.id] = f.usageCount; });
      console.log(`📊 [FilterCounter] Initialisé : ${Object.keys(filterCounters).length} filtres`);
      return true;
    } catch (error) {
      console.error('❌ [FilterCounter] Erreur init:', error);
      return false;
    }
  },

  registerClick: (filterId) => {
    if (filterCounters[filterId] === undefined) return { success: false };
    filterCounters[filterId]++;
    return { success: true, filterId, usageCount: filterCounters[filterId] };
  },

  getAllState: () => {
    return Object.entries(filterCounters).map(([id, count]) => ({
      filterId: parseInt(id),
      usageCount: count
    }));
  },

  load: async (filterId) => {
    try {
      const filter = await models.Filter.findByPk(filterId);
      if (filter && filter.isActive) {
        filterCounters[filter.id] = filter.usageCount;
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ [FilterCounter] Erreur load:', error);
      return false;
    }
  },

  unload: (filterId) => {
    if (filterCounters[filterId] !== undefined) delete filterCounters[filterId];
  },

  sync: async () => {
    try {
      const promises = Object.keys(filterCounters).map(id => 
        models.Filter.update({ usageCount: filterCounters[id] }, { where: { id } })
      );
      if (promises.length) await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('❌ [FilterCounter] Erreur Synchro:', error);
      return false;
    }
  }
};

module.exports = filterCounterService;