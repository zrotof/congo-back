const { models } = require('../models');

let activeChallenge = null;

const challengeCounterService = {

  init: async () => {
    try {
      const challenge = await models.Challenge.findOne({ where: { isActive: true } });
      if (challenge) {
        activeChallenge = {
          id: challenge.id,
          currentViews: challenge.currentViews,
          targetViews: challenge.targetViews,
          imageUrl: challenge.imageUrl
        };
        console.log(`✅ [ChallengeCounter] Challenge #${challenge.id} chargé`);
      }
      return true;
    } catch (error) {
      console.error('❌ [ChallengeCounter] Erreur init:', error);
      return false;
    }
  },

  registerView: () => {
    if (!activeChallenge) return { success: false, reason: 'Aucun challenge actif' };

    const { id, targetViews } = activeChallenge;
    const currentBefore = activeChallenge.currentViews;
    const wasAlreadyRevealed = currentBefore >= targetViews;

    activeChallenge.currentViews++;
    const newCount = activeChallenge.currentViews;
    const progress = Math.min((newCount / targetViews) * 100, 100);
    const justRevealed = !wasAlreadyRevealed && newCount >= targetViews;

    if (justRevealed) console.log(`🎉 [ChallengeCounter] Révélé !`);

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

  getState: () => {
    if (!activeChallenge) return null;
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

  load: async (challengeId) => {
    try {
      const challenge = await models.Challenge.findByPk(challengeId);
      if (challenge && challenge.isActive) {
        activeChallenge = {
          id: challenge.id,
          currentViews: challenge.currentViews,
          targetViews: challenge.targetViews,
          imageUrl: challenge.imageUrl
        };
        console.log(`📥 [ChallengeCounter] Chargé #${challengeId}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ [ChallengeCounter] Erreur load:', error);
      return false;
    }
  },

  unload: () => {
    activeChallenge = null;
    console.log(`📤 [ChallengeCounter] Déchargé`);
  },

  sync: async () => {
    try {
      if (activeChallenge) {
        await models.Challenge.update(
          { currentViews: activeChallenge.currentViews },
          { where: { id: activeChallenge.id } }
        );
      }
      return true;
    } catch (error) {
      console.error('❌ [ChallengeCounter] Erreur Synchro:', error);
      return false;
    }
  }
};

module.exports = challengeCounterService;