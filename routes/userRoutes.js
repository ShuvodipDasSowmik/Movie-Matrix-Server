const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')
const userController = require('../controllers/userController');

router.put('/update-user', verifyToken, userController.updateUser);
router.post('/signup', userController.signUp);
router.post('/signin', ((req, res) => userController.signIn(req, res)));
router.get('/user/:username', verifyToken, userController.getUser);
router.post('/refresh-token', userController.refreshToken);

module.exports = router;