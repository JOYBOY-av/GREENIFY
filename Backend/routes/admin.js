const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const ctrl = require('../controllers/adminController');

router.post('/login', ctrl.adminLogin);

router.get('/stats', adminAuth, ctrl.getStats);

router.get('/users', adminAuth, ctrl.getAllUsers);
router.delete('/users/:id', adminAuth, ctrl.deleteUser);
router.put('/users/:id/role', adminAuth, ctrl.updateUserRole);

router.get('/badges', adminAuth, ctrl.getAllBadges);
router.post('/badges', adminAuth, ctrl.createBadge);
router.put('/badges/:id', adminAuth, ctrl.updateBadge);
router.delete('/badges/:id', adminAuth, ctrl.deleteBadge);

router.get('/actions', adminAuth, ctrl.getAllActions);
router.post('/actions', adminAuth, ctrl.createAction);
router.put('/actions/:id', adminAuth, ctrl.updateAction);
router.delete('/actions/:id', adminAuth, ctrl.deleteAction);

router.get('/legal', ctrl.getLegalPages);
router.get('/legal/:slug', ctrl.getLegalPage);
router.put('/legal/:slug', adminAuth, ctrl.updateLegalPage);

module.exports = router;
