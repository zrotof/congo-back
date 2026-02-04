const { models } = require('../models');

// Cache RAM
let challengeCounters = {};
let challengeTargets = {};
let filterCounters = {};

const clickService = {

  // ══════════════════════════════════════════════════════════
  //                    INITIALISATION
  // ══════════════════════════════════════════════════════════
  
  init: async () => {
    try {
      // 1. Charger les Challenges actifs
      const challenges = await models.Challenge.findAll({ 
        where: { isActive: true } 
      });
      challenges.forEach(c => {
        challengeCounters[c.id] = c.currentClicks;
        challengeTargets[c.id] = c.targetClicks;
      });

      // 2. Charger les Filtres Snapchat actifs
      const filters = await models.SnapFilter.findAll({ 
        where: { isActive: true } 
      });
      filters.forEach(f => {
        filterCounters[f.id] = f.usageCount;
      });

      console.log(`📊 ClickService initialisé :`);
      console.log(`   → ${Object.keys(challengeCounters).length} challenge(s)`);
      console.log(`   → ${Object.keys(filterCounters).length} filtre(s)`);
      
    } catch (error) {
      console.error('❌ Erreur init ClickService:', error);
    }
  },

  // ══════════════════════════════════════════════════════════
  //                    CHALLENGES (Défloutage)
  // ══════════════════════════════════════════════════════════

  registerChallengeClick: (challengeId, socketId) => {
    if (challengeCounters[challengeId] === undefined) {
      return { success: false, reason: 'Challenge non trouvé' };
    }

    const target = challengeTargets[challengeId];
    const current = challengeCounters[challengeId];

    if (current >= target) {
      return { success: false, reason: 'Déjà révélé' };
    }

    challengeCounters[challengeId]++;
    const newCount = challengeCounters[challengeId];
    const progress = Math.min((newCount / target) * 100, 100);

    console.log(`🖱️ Challenge #${challengeId} : ${newCount}/${target} (${progress.toFixed(1)}%)`);

    return {
      success: true,
      newCount,
      target,
      progress,
      targetReached: newCount >= target
    };
  },

  getChallengeState: (challengeId) => {
    if (challengeCounters[challengeId] === undefined) return null;
    
    const current = challengeCounters[challengeId];
    const target = challengeTargets[challengeId];
    
    return {
      currentClicks: current,
      targetClicks: target,
      progress: Math.min((current / target) * 100, 100),
      isRevealed: current >= target
    };
  },

  // ══════════════════════════════════════════════════════════
  //                    FILTRES SNAPCHAT
  // ══════════════════════════════════════════════════════════

  registerFilterClick: (filterId, socketId) => {
    if (filterCounters[filterId] === undefined) {
      return { success: false, reason: 'Filtre non trouvé' };
    }

    filterCounters[filterId]++;
    const newCount = filterCounters[filterId];

    console.log(`📸 Filtre #${filterId} utilisé : ${newCount} fois`);

    return {
      success: true,
      filterId,
      newCount
    };
  },

  getFilterState: (filterId) => {
    if (filterCounters[filterId] === undefined) return null;
    return { usageCount: filterCounters[filterId] };
  },

  getAllFiltersState: () => {
    return Object.entries(filterCounters).map(([id, count]) => ({
      filterId: parseInt(id),
      usageCount: count
    }));
  },

  // ══════════════════════════════════════════════════════════
  //                    RECHARGEMENT DYNAMIQUE
  // ══════════════════════════════════════════════════════════

  loadChallenge: async (challengeId) => {
    const challenge = await models.Challenge.findByPk(challengeId);
    if (challenge && challenge.isActive) {
      challengeCounters[challenge.id] = challenge.currentClicks;
      challengeTargets[challenge.id] = challenge.targetClicks;
    }
  },

  loadFilter: async (filterId) => {
    const filter = await models.SnapFilter.findByPk(filterId);
    if (filter && filter.isActive) {
      filterCounters[filter.id] = filter.usageCount;
    }
  },

  // ══════════════════════════════════════════════════════════
  //                    SYNCHRO BASE DE DONNÉES
  // ══════════════════════════════════════════════════════════

  syncToDatabase: async () => {
    try {
      // Synchro Challenges
      for (const id in challengeCounters) {
        await models.Challenge.update(
          { currentClicks: challengeCounters[id] },
          { where: { id } }
        );
      }

      // Synchro Filtres
      for (const id in filterCounters) {
        await models.SnapFilter.update(
          { usageCount: filterCounters[id] },
          { where: { id } }
        );
      }

      console.log('💾 Synchro DB : Challenges + Filtres sauvegardés');
    } catch (error) {
      console.error('❌ Erreur Synchro:', error);
    }
  }
};

module.exports = clickService;