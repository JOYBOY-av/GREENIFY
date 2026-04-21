const express = require('express');
const router = express.Router();
const actionsController = require('../controllers/actionsController');
const auth = require('../middleware/auth');

router.get('/types', auth, actionsController.getActionTypes);
router.post('/', auth, actionsController.logAction);
router.get('/my', auth, actionsController.getMyActions);

module.exports = router;
