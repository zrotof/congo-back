const globalCounterService = require('../services/global-counter.service');

exports.getGlobalStats = (req, res, next) => {
  try {
    const count = globalCounterService.getCount();
    
    return res.status(200).json({
      status: 'success',
      data: {
        totalVisits: count
      },
      message: 'Statistiques globales récupérées'
    });
  } catch (error) {
    next(error);
  }
};