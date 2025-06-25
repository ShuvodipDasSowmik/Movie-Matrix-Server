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

       //FOR SEARCH IMPLEMENTATION

    //  static async getMovieBySearch(req, res){
    //     try {
    //         const mediaid = req.params.keyword;

    //         const movieData = await MediaModel.getMovieBySearch(keyword);

    //         return res.status(200).json({
    //             message: 'Success',
    //             movieData
    //         });
    //     }
        
    //     catch (error) {
    //         return res.status(404).json({
    //             message: error.message
    //         })
    //     }
    // }


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


    //FOR SEARCH IMPLEMENTATION

    //      static async getSeriesBySearch(req, res){
    //     try {
    //         const mediaid = req.params.keyword;

    //         const seriesData = await MediaModel.getSeriesBySearch(keyword);

    //         return res.status(200).json({
    //             message: 'Success',
    //             seriesData
    //         });
    //     }
        
    //     catch (error) {
    //         return res.status(404).json({
    //             message: error.message
    //         })
    //     }
    // }



}

module.exports = MediaController;