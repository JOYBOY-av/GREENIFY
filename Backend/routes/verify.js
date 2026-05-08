const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// New endpoint: /api/verify
router.post('/', auth, upload.single('proof'), verificationController.verifyAction);

module.exports = router;
