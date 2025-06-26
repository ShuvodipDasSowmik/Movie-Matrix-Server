const router = require('express').Router();
const actorController = require('../controllers/actorController');

router.get('/actors/:actorid', actorController.getActorByID);
router.get('/actors', actorController.getAllActors);

module.exports = router;