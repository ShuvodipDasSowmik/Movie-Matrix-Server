const ActorModel = require('../models/actorModel');

class ActorController {
    static async getActorByID(req, res) {
        const actorid = req.params.actorid;
        console.log(actorid);
        
        try {
            const actorData = await ActorModel.getActorByID(actorid);
            
            res.status(200).json({
                message: 'Success',
                actorData
            });
        }
        
        catch (queryError) {
            console.log(`Query Failed for ${actorid}: ${queryError.message}`);

            res.status(404).json({
                message: queryError.message
            });
        }
    }

    static async getAllActors(req, res) {
        try {
            const actorsData = await ActorModel.getAllActors();
            
            res.status(200).json({
                message: 'Success',
                actorsData
            });
        }
        
        catch (queryError) {
            console.log(`Query Failed: ${queryError.message}`);

            res.status(500).json({
                message: queryError.message
            });
        }
    }
}

module.exports = ActorController;