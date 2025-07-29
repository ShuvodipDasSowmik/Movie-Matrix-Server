const router = require('express').Router();
const MediaController = require('../controllers/mediaController')

router.get('/movies', MediaController.getAllMovies);
router.get('/movie/:mediaid', MediaController.getMovieByID);
router.get('/series', MediaController.getAllSeries);
router.get('/series1/:mediaid', MediaController.getSeriesByID);
router.get('/episodes/:seasonid', MediaController.getEpisodesByID);
router.get('/media-by-genre', MediaController.getAllMediaByGenre);
router.get('/media-by-genre/:genreid', MediaController.getMediaByGenre);

module.exports = router;