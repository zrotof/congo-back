const express = require('express');
const router = express.Router();
const passport = require('passport');
const upload = require('../middlewares/multer.middleware');

const {
  getActiveFilters,
  getAll,
  getById,
  create,
  update,
  remove
} = require('../controllers/filter.controller');

const authGuard = passport.authenticate('admin-jwt', { session: false });

// ══════════════════════════════════════════════════════
//                    ROUTES PUBLIQUES
// ══════════════════════════════════════════════════════

router.get('/public', getActiveFilters);

// ══════════════════════════════════════════════════════
//                    ROUTES ADMIN (protégées)
// ══════════════════════════════════════════════════════

router.get('/', authGuard, getAll);
router.get('/:id', authGuard, getById);
router.post('/', authGuard, upload.single('image'), create);        // ✅ Avec upload
router.put('/:id', authGuard, upload.single('image'), update);      // ✅ Avec upload
router.delete('/:id', authGuard, remove);

module.exports = router;