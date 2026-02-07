const challengeService = require('../services/challenge-counter.service');

module.exports = (io, socket) => {
  socket.on('JOIN_CHALLENGE', () => {
    socket.join('challenge');
    const result = challengeService.registerView();

    if (result.success) {
      io.to('challenge').emit('CHALLENGE_UPDATE', {
        challengeId: result.challengeId,
        currentViews: result.currentViews,
        targetViews: result.targetViews,
        progress: result.progress,
        isRevealed: result.isRevealed
      });

      if (result.justRevealed) {
        io.to('challenge').emit('CHALLENGE_REVEALED', {
          challengeId: result.challengeId,
          originalImageUrl: result.originalImageUrl
        });
      }
    } else {
      const state = challengeService.getState();
      if (state) socket.emit('CHALLENGE_STATE', state);
    }
  });

  socket.on('LEAVE_CHALLENGE', () => socket.leave('challenge'));
  
  socket.on('GET_CHALLENGE_STATE', () => {
    const state = challengeService.getState();
    if (state) socket.emit('CHALLENGE_STATE', state);
  });
};