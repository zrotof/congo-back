const globalService = require('../services/global-counter.service');

module.exports = (io, socket) => {

  // Quand un visiteur arrive, on incrémente et on broadcast
  socket.on('JOIN_GLOBAL', () => {
    socket.join('global');
    const count = globalService.registerVisit();
    io.to('global').emit('GLOBAL_UPDATE', { totalVisits: count });
  });

  socket.on('LEAVE_GLOBAL', () => {
    socket.leave('global');
  });
};

module.exports = (io, socket) => {

  /**
   * Le client rejoint la room 'global'
   * Uniquement pour écouter les mises à jour futures.
   * L'incrémentation est gérée par l'API REST (POST /visit).
   */
  socket.on('JOIN_GLOBAL', () => {
    socket.join('global');
    // Pas d'action ici.
  });

  socket.on('LEAVE_GLOBAL', () => {
    socket.leave('global');
  });
};