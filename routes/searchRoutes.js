const router = require('express').Router();
const SearchController = require('../controllers/searchController');

router.get('/search/:keyword', SearchController.getCombinedSearch);

module.exports = router; 