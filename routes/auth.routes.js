const express = require('express');
const router = express.Router();
const passport = require('passport');
const { login, logout, me } = require('../controllers/auth.controller');

const authGuard = passport.authenticate('admin-jwt', { session: false });

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authGuard, me);

module.exports = router;