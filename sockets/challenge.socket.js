const viewService = require('../services/view.service');

module.exports = (io, socket) => {

  /**
   * JOIN_CHALLENGE
   * Quand un utilisateur arrive sur la page du challenge
   * → +1 vue automatiquement
   */
  socket.on('JOIN_CHALLENGE', () => {
    socket.join('challenge');

    const result = viewService.registerView();

    if (result.success) {
      // Envoyer la mise à jour à TOUS les clients
      io.to('challenge').emit('CHALLENGE_UPDATE', {
        challengeId: result.challengeId,
        currentViews: result.currentViews,
        targetViews: result.targetViews,
        progress: result.progress,
        isRevealed: result.isRevealed
      });

      // Si vient d'être révélé
      if (result.justRevealed) {
        io.to('challenge').emit('CHALLENGE_REVEALED', {
          challengeId: result.challengeId,
          originalImageUrl: result.originalImageUrl
        });
      }
    } else {
      // Envoyer l'état actuel quand même
      const state = viewService.getChallengeState();
      if (state) {
        socket.emit('CHALLENGE_STATE', state);
      } else {
        socket.emit('CHALLENGE_ERROR', {
          message: 'Aucun challenge actif'
        });
      }
    }
  });

  /**
   * LEAVE_CHALLENGE
   * Client quitte la page du challenge
   */
  socket.on('LEAVE_CHALLENGE', () => {
    socket.leave('challenge');
  });

  /**
   * GET_CHALLENGE_STATE
   * Demande l'état sans incrémenter
   */
  socket.on('GET_CHALLENGE_STATE', () => {
    const state = viewService.getChallengeState();
    if (state) {
      socket.emit('CHALLENGE_STATE', state);
    } else {
      socket.emit('CHALLENGE_ERROR', {
        message: 'Aucun challenge actif'
      });
    }
  });
};