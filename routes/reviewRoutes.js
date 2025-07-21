const router = require('express').Router();
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/reviews/:mediaid', reviewController.getMovieReviewByID);
router.post('/create-review', verifyToken, reviewController.createMovieReview);
router.put('/update-review/:reviewid', verifyToken, reviewController.updateMovieReview);
router.delete('/delete-review/:reviewid', verifyToken, reviewController.deleteMovieReview);

router.get('/episode-reviews/:seasonid', reviewController.getEpisodeReviewByID);
router.post('/create-episode-review', verifyToken, reviewController.createEpisodeReview);
router.put('/update-episode-review', verifyToken, reviewController.updateEpisodeReview);
router.delete('/delete-episode-review', verifyToken, reviewController.deleteEpisodeReview);

module.exports = router;