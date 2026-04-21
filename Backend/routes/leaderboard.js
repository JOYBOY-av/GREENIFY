const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const auth = require('../middleware/auth');

router.get('/weekly', auth, leaderboardController.getWeekly);
router.get('/alltime', auth, leaderboardController.getAllTime);

module.exports = router;
