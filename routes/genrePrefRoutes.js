const router = require('express').Router();
const genrePrefController = require('../controllers/genrePrefController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/genre-pref/:username', genrePrefController.getGenrePrefByID);
router.post('/add-genre-pref', verifyToken, genrePrefController.addGenrePref);
router.delete('/remove-genre-pref/:username/:genreid', verifyToken, genrePrefController.removeGenrePref);
router.get('/available-genres', verifyToken, genrePrefController.getAvailableGenres);
router.get('/media-by-genre-pref/:username', verifyToken, genrePrefController.getMediaByUserPreferences);

module.exports = router;