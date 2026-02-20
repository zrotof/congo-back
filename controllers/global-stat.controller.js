const globalCounterService = require('../services/global-counter.service');

/**
 * POST /api/stats/visit
 * Incrémente le compteur et notifie via Socket
 */
exports.registerVisit = (req, res, next) => {
  try {
    // 1. Incrémenter en RAM
    const count = globalCounterService.registerVisit();

    // 2. Notifier tous les clients connectés via Socket.io
    const io = req.app.get('io'); // Récupéré depuis app.set('io', ...)
    if (io) {
      io.to('global').emit('GLOBAL_UPDATE', { totalVisits: count });
    }

    // 3. Répondre au client HTTP
    return res.status(200).json({
      status: 'success',
      data: { totalVisits: count },
      message: 'Visite enregistrée'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/stats
 * Lecture seule (pour l'Admin)
 */
exports.getGlobalStats = (req, res, next) => {
  try {
    const count = globalCounterService.getCount();
    
    return res.status(200).json({
      status: 'success',
      data: { totalVisits: count },
      message: 'Statistiques récupérées'
    });
  } catch (error) {
    next(error);
  }
};