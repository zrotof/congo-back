const globalCounterService = require('../services/global-counter.service');

// ✅ POST /api/stats/visit
exports.registerVisit = (req, res, next) => {
  try {
    // 1. Incrémenter en RAM
    const count = globalCounterService.registerVisit();

    // 2. Diffuser aux AUTRES via Socket
    const io = req.app.get('io'); // Récupéré depuis app.js
    if (io) {
      io.to('global').emit('GLOBAL_UPDATE', { totalVisits: count });
    }

    // 3. Répondre au visiteur actuel (HTTP direct)
    return res.status(200).json({
      status: 'success',
      data: { totalVisits: count },
      message: 'Visite enregistrée'
    });
  } catch (error) {
    next(error);
  }
};

// ✅ GET /api/stats (Lecture seule)
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