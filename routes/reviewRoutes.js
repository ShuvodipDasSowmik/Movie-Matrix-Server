const router = require('express').Router();
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/reviews/:mediaid', reviewController.getMovieReviewByID);
router.post('/create-review', verifyToken, reviewController.createMovieReview);
router.put('/update-review/:reviewid', verifyToken, reviewController.updateMovieReview);
router.delete('/delete-review/:reviewid', verifyToken, reviewController.deleteMovieReview);

module.exports = router;