const router = require('express').Router();
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/reviews/:mediaid', reviewController.getReviewsByMediaID);
router.post('/create-review', verifyToken, reviewController.createReview);
router.put('/update-review/:reviewid', verifyToken, reviewController.updateReview);
router.delete('/delete-review/:reviewid', verifyToken, reviewController.deleteReview);