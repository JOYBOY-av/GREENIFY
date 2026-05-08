const express = require('express');
const router = express.Router();
const actionsController = require('../controllers/actionsController');
const auth = require('../middleware/auth');

const aiController = require('../controllers/aiController');

router.get('/types', auth, actionsController.getActionTypes);
router.post('/analyze', auth, aiController.analyzeAction);
router.post('/', auth, actionsController.logAction);
router.get('/my', auth, actionsController.getMyActions);
router.get('/limits', auth, actionsController.getLimits);

module.exports = router;
