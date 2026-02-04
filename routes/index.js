const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/challenges', require('./challenge.routes'));
router.use('/snapfilters', require('./snap-filter.routes'));

module.exports = router;