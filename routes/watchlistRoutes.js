const router = require('express').Router();
const WatchlistController = require('../controllers/watchlistController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/watchlist/:username', verifyToken, WatchlistController.getWatchlistByUsername);
router.post('/add-media', verifyToken, WatchlistController.AddMediaToWatchList);
router.post('/create-watchlist', verifyToken, WatchlistController.createWatchlist);

module.exports = router;