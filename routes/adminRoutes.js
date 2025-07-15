const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middlewares/verifyToken');

// Route for admin data entry operations
router.post('/admin', verifyToken, adminController.handleAdminEntry);

// Route for getting admin statistics
router.get('/adminStat', verifyToken, adminController.getAdminStats);

module.exports = router;
