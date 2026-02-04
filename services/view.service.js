const { models } = require('../models');

// ══════════════════════════════════════════════════════
//                    CACHE RAM
// ══════════════════════════════════════════════════════

let activeChallenge = null;   // { id, currentViews, targetViews, imageUrl }
let filterCounters = {};      // { filterId: usageCount }

const viewService = {

  // ══════════════════════════════════════════════════════
  //                    INITIALISATION
  // ══════════════════════════════════════════════════════

  init: async () => {
    try {
      // 1. Charger le challenge actif (un seul à la fois)
      const challenge = await models.Challenge.findOne({
        where: { isActive: true }
      });

      if (challenge) {
        activeChallenge = {
          id: challenge.id,
          currentViews: challenge.currentViews,
          targetViews: challenge.targetViews,
          imageUrl: challenge.imageUrl
        };
        console.log(`   → Challenge #${challenge.id} chargé (${challenge.currentViews}/${challenge.targetViews})`);
      } else {
        console.log(`   → Aucun challenge actif`);
      }

      // 2. Charger les filtres Snapchat actifs
      const filters = await models.SnapFilter.findAll({
        where: { isActive: true }
      });

      filters.forEach(f => {
        filterCounters[f.id] = f.usageCount;
      });

      console.log(`📊 ViewService initialisé :`);
      console.log(`   → ${filters.length} filtre(s) en RAM`);

      return true;
    } catch (error) {
      console.error('❌ Erreur init ViewService:', error);
      return false;
    }
  },

  // ══════════════════════════════════════════════════════
  //                    CHALLENGE (Vues automatiques)
  // ══════════════════════════════════════════════════════

  hasActiveChallenge: () => {
    return activeChallenge !== null;
  },

  getActiveChallengeId: () => {
    return activeChallenge?.id || null;
  },

  registerView: () => {
    if (!activeChallenge) {
      return {
        success: false,
        reason: 'Aucun challenge actif'
      };
    }

    const { id, targetViews } = activeChallenge;
    const currentBefore = activeChallenge.currentViews;
    const wasAlreadyRevealed = currentBefore >= targetViews;

    activeChallenge.currentViews++;
    const newCount = activeChallenge.currentViews;
    const progress = Math.min((newCount / targetViews) * 100, 100);
    const justRevealed = !wasAlreadyRevealed && newCount >= targetViews;

    console.log(`👁️ Vue #${newCount} sur Challenge #${id} (${progress.toFixed(1)}%)`);

    if (justRevealed) {
      console.log(`🎉 Challenge #${id} RÉVÉLÉ !`);
    }

    return {
      success: true,
      challengeId: id,
      currentViews: newCount,
      targetViews,
      progress,
      isRevealed: newCount >= targetViews,
      justRevealed,
      originalImageUrl: justRevealed ? activeChallenge.imageUrl : null
    };
  },

  getChallengeState: () => {
    if (!activeChallenge) {
      return null;
    }

    const { id, currentViews, targetViews, imageUrl } = activeChallenge;
    const isRevealed = currentViews >= targetViews;

    return {
      challengeId: id,
      currentViews,
      targetViews,
      progress: Math.min((currentViews / targetViews) * 100, 100),
      isRevealed,
      originalImageUrl: isRevealed ? imageUrl : null
    };
  },

  loadChallenge: async (challengeId) => {
    try {
      const challenge = await models.Challenge.findByPk(challengeId);
      if (challenge && challenge.isActive) {
        activeChallenge = {
          id: challenge.id,
          currentViews: challenge.currentViews,
          targetViews: challenge.targetViews,
          imageUrl: challenge.imageUrl
        };
        console.log(`📥 Challenge #${challengeId} chargé en RAM`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`❌ Erreur chargement Challenge #${challengeId}:`, error);
      return false;
    }
  },

  unloadChallenge: () => {
    if (activeChallenge) {
      console.log(`📤 Challenge #${activeChallenge.id} retiré de la RAM`);
      activeChallenge = null;
    }
  },

  // ══════════════════════════════════════════════════════
  //                    FILTRES SNAPCHAT (Clics manuels)
  // ══════════════════════════════════════════════════════

  registerFilterClick: (filterId) => {
    if (filterCounters[filterId] === undefined) {
      return {
        success: false,
        reason: 'Filtre non trouvé ou inactif'
      };
    }

    filterCounters[filterId]++;
    const newCount = filterCounters[filterId];

    console.log(`📸 Filtre #${filterId} utilisé : ${newCount} fois`);

    return {
      success: true,
      filterId,
      usageCount: newCount
    };
  },

  getAllFiltersState: () => {
    return Object.entries(filterCounters).map(([id, count]) => ({
      filterId: parseInt(id),
      usageCount: count
    }));
  },

  loadFilter: async (filterId) => {
    try {
      const filter = await models.SnapFilter.findByPk(filterId);
      if (filter && filter.isActive) {
        filterCounters[filter.id] = filter.usageCount;
        console.log(`📥 Filtre #${filterId} chargé en RAM`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`❌ Erreur chargement Filtre #${filterId}:`, error);
      return false;
    }
  },

  unloadFilter: (filterId) => {
    delete filterCounters[filterId];
    console.log(`📤 Filtre #${filterId} retiré de la RAM`);
  },

  // ══════════════════════════════════════════════════════
  //                    SYNCHRONISATION DB
  // ══════════════════════════════════════════════════════

  syncToDatabase: async () => {
    try {
      if (activeChallenge) {
        await models.Challenge.update(
          { currentViews: activeChallenge.currentViews },
          { where: { id: activeChallenge.id } }
        );
      }

      for (const id in filterCounters) {
        await models.SnapFilter.update(
          { usageCount: filterCounters[id] },
          { where: { id } }
        );
      }

      console.log('💾 Synchro DB effectuée');
      return true;
    } catch (error) {
      console.error('❌ Erreur Synchro DB:', error);
      return false;
    }
  }
};

module.exports = viewService;