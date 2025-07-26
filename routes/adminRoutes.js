const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middlewares/verifyToken');
const checkAdmin = require('../middlewares/checkAdmin');

// Route for admin data entry operations
router.post('/admin', verifyToken, checkAdmin, adminController.handleAdminEntry);

// Route for getting admin statistics
router.get('/adminStat', verifyToken, adminController.getAdminStats);
router.post('/admin/send-email', verifyToken, checkAdmin, adminController.sendEmail);
router.get('/admin/user-location', verifyToken, checkAdmin, adminController.getUserLocationInfo);

module.exports = router;
