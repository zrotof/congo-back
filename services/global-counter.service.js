const { models } = require('../models');

// Variable en mémoire (RAM)
let globalVisits = 0;

const globalCounterService = {

  /**
   * Initialisation au démarrage du serveur
   */
  init: async () => {
    try {
      let stat = await models.GlobalStat.findOne();
      
      // Si la table est vide, on initialise
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

  /**
   * Incrémente le compteur (+1)
   * Retourne la nouvelle valeur
   */
  registerVisit: () => {
    globalVisits++;
    return globalVisits;
  },

  /**
   * Retourne la valeur actuelle (lecture seule)
   */
  getCount: () => {
    return globalVisits;
  },

  /**
   * Sauvegarde la RAM vers la BDD
   */
  sync: async () => {
    try {
      await models.GlobalStat.update(
        { totalVisits: globalVisits },
        { where: { id: 1 } } // On suppose l'ID 1
      );
      return true;
    } catch (error) {
      console.error('❌ [GlobalService] Erreur Synchro:', error);
      return false;
    }
  }
};

module.exports = globalCounterService;