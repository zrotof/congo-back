const globalService = require('../services/global-counter.service');

module.exports = (io, socket) => {

  /**
   * JOIN_GLOBAL
   * @param {Function} callback - Fonction pour répondre directement au client
   */
  socket.on('JOIN_GLOBAL', (callback) => {
    socket.join('global');
    
    // 1. Incrémenter le compteur (+1 visite)
    const count = globalService.registerVisit();
    
    console.log(`🌍 Nouvelle visite ! Total: ${count}`);

    // 2. Broadcast aux AUTRES utilisateurs connectés
    socket.to('global').emit('GLOBAL_UPDATE', { totalVisits: count });

    // 3. ✅ RÉPONSE DIRECTE AU CLIENT (Callback)
    // C'est ici qu'on garantit que celui qui vient d'arriver reçoit la bonne valeur
    if (typeof callback === 'function') {
      callback({ totalVisits: count });
    }
  });

  socket.on('LEAVE_GLOBAL', () => {
    socket.leave('global');
  });
};