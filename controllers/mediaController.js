const MediaModel = require('../models/mediaModel')

class MediaController{
    static async getAllMovies(req, res){
        try {
            const movieData = await MediaModel.getAllMovies();

            return res.status(200).json({
                message: 'Success',
                movieData
            });
        }
        
        catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    }

    static async getMovieByID(req, res){
        try {
            const mediaid = req.params.mediaid;

            const movieData = await MediaModel.getMovieByID(mediaid);

            return res.status(200).json({
                message: 'Success',
                movieData
            });
        }
        
        catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    }

    static async getAllSeries(req, res){
        try {
            const seriesData = await MediaModel.getAllSeries();

            return res.status(200).json({
                message: 'Success',
                seriesData
            });
        }
        
        catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    }



    static async getSeriesByID(req, res){
        try {
            const mediaid = req.params.mediaid;

            const seriesData = await MediaModel.getSeriesByID(mediaid);

            return res.status(200).json({
                message: 'Success',
                seriesData
            });
        }
        
        catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    }


     static async getEpisodesByID(req, res){
        try {
            const seasonid = req.params.seasonid;
            const episodesData = await MediaModel.getEpisodesByID(seasonid);

            return res.status(200).json({
                message: 'Success',
                episodesData
            });
        }
        
        catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    }

    static async getAllMediaByGenre(req, res){
        try{
            const mediaData = await MediaModel.getAllMediaByGenre();

            return res.status(200).json({
                message: 'Success',
                mediaData
            });
        }

        catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    }

    static async getMediaByGenre(req, res){
        try{
            const mediaData = await MediaModel.getMediaByGenre(req.params.genreid);

            return res.status(200).json({
                message: 'Success',
                mediaData
            });
        }
        
        catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    }

}

module.exports = MediaController;