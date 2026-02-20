const express = require('express');
const router = express.Router();
const { getGlobalStats, registerVisit } = require('../controllers/global-stat.controller');

// Route pour l'Admin (Lecture seule)
router.get('/', getGlobalStats);

// Route pour le Public (Incrémentation)
router.post('/visit', registerVisit);

module.exports = router;