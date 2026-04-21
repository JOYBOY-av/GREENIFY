const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

router.get('/', auth, profileController.getProfile);
router.put('/', auth, profileController.updateProfile);
router.post('/photo', auth, profileController.uploadPhoto);
router.delete('/', auth, profileController.deleteProfile);

module.exports = router;
