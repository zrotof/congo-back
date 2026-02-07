const express = require('express');
const router = express.Router();

// Import des sous-routes
const authRoutes = require('./auth.routes');
const challengeRoutes = require('./challenge.routes');
const snapfilterRoutes = require('./filter.routes');
const globalStatRoutes = require('./global-stat.routes');

// Montage des routes
router.use('/auth', authRoutes);
router.use('/challenges', challengeRoutes);
router.use('/filters', snapfilterRoutes);
router.use('/stats', globalStatRoutes); // ✅ Route pour le compteur global

// Route de santé (Health Check)
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

module.exports = router;