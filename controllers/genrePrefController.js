const genrePrefModel = require('../models/genrePrefModel');

class genrePrefController {
    static async getGenrePrefByID(req, res){
        try {
            const username = req.params.username;

            const genreData = await genrePrefModel.getGenrePrefByID(username);

            return res.status(200).json({
                message: 'Success',
                genreData
            });
        }
        catch (error) {
            console.error(error.message);
            return res.status(500).json({
                message: error.message
            });
        }
    }

    static async addGenrePref(req, res){
        try {
            const genreData = req.body;
            
            const result = await genrePrefModel.addGenrePref(genreData);

            return res.status(200).json({
                message: 'Success',
                data: result
            });
        }
        catch (error) {
            console.error(error.message);
            
            return res.status(500).json({
                message: error.message
            });
        }
    }

    static async removeGenrePref(req, res){
        try {
            const username = req.params.username;
            const genreid = req.params.genreid;
            
            await genrePrefModel.removeGenrePref(username, genreid);

            return res.status(200).json({
                message: 'Success'
            });
        }
        catch (error) {
            console.error(error.message);
            
            return res.status(500).json({
                message: error.message
            });
        }
    }

    static async getAvailableGenres(req, res){
        try {
            const genres = await genrePrefModel.getAllGenres();

            return res.status(200).json({
                message: 'Success',
                genres
            });
        }
        catch (error) {
            console.error(error.message);
            
            return res.status(500).json({
                message: error.message
            });
        }
    }
}

module.exports = genrePrefController;