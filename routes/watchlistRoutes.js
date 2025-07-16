const router = require('express').Router();
const WatchlistController = require('../controllers/watchlistController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/watchlist/:username', verifyToken, WatchlistController.getWatchlistByUsername);
router.post('/add-media', verifyToken, WatchlistController.AddMediaToWatchList);
router.post('/create-watchlist', verifyToken, WatchlistController.createWatchlist);
router.delete('/delete-watchlist/:watchlistid', verifyToken, WatchlistController.deleteWatchlist);
router.delete('/remove-media/:watchlistid/:mediaid', verifyToken, WatchlistController.removeMediaFromWatchlist);
router.put('/update-watchlist/:watchlistid', verifyToken, WatchlistController.updateWatchlist);
router.get('/get-watchlist/:watchlistid', verifyToken, WatchlistController.getWatchlistMedia);
router.post('/toggle-watch-status', verifyToken, WatchlistController.toggleIsWatched);

module.exports = router;