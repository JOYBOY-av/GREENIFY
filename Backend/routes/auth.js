const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/verify-signup', authController.verifySignup);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);

router.post('/change-password', auth, authController.changePassword);
router.post('/send-change-otp', auth, authController.sendChangeOtp);
router.post('/verify-otp-reset', auth, authController.verifyOtpAndReset);

module.exports = router;
