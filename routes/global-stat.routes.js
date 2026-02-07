const express = require('express');
const router = express.Router();
const { getGlobalStats } = require('../controllers/global-stat.controller');

router.get('/', getGlobalStats);

module.exports = router;