const { models } = require('../models');

let globalVisits = 0;

const globalCounterService = {

  init: async () => {
    try {
      let stat = await models.GlobalStat.findOne();
      if (!stat) {
        stat = await models.GlobalStat.create({ totalVisits: 0 });
      }
      globalVisits = stat.totalVisits;
      console.log(`🌍 [GlobalService] Initialisé : ${globalVisits} visites`);
      return true;
    } catch (error) {
      console.error('❌ [GlobalService] Erreur init:', error);
      return false;
    }
  },

  registerVisit: () => {
    globalVisits++;
    return globalVisits;
  },

  getCount: () => {
    return globalVisits;
  },

  sync: async () => {
    try {
      await models.GlobalStat.update({ totalVisits: globalVisits }, { where: { id: 1 } });
      return true;
    } catch (error) {
      console.error('❌ [GlobalService] Erreur Synchro:', error);
      return false;
    }
  }
};

module.exports = globalCounterService;