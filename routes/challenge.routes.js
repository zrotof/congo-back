const express = require('express');
const router = express.Router();
const passport = require('passport');
const upload = require('../middlewares/multer.middleware');

const {
  getActiveChallenge,
  getAll,
  getById,
  create,
  update,
  activate,
  deactivate,
  remove
} = require('../controllers/challenge.controller');

const authGuard = passport.authenticate('admin-jwt', { session: false });

// Routes publiques
router.get('/public/active', getActiveChallenge);

// Routes admin
router.get('/', authGuard, getAll);
router.get('/:id', authGuard, getById);
router.post('/', authGuard, upload.single('image'), create);
router.put('/:id', authGuard, upload.single('image'), update);
router.post('/:id/activate', authGuard, activate);
router.post('/:id/deactivate', authGuard, deactivate);
router.delete('/:id', authGuard, remove);

module.exports = router;