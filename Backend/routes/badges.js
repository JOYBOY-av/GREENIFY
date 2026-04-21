const express = require('express');
const router = express.Router();
const badgesController = require('../controllers/badgesController');
const auth = require('../middleware/auth');

router.get('/', auth, badgesController.getAllBadges);
router.get('/my-badges', auth, badgesController.getMyBadges);

module.exports = router;
