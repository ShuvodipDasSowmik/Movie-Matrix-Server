const WatchlistModel = require('../models/watchlistModel');

class WatchlistController {
    static async getWatchlistByUsername(req, res) {
        try {
            const { username } = req.params;
            const watchlist = await WatchlistModel.getWatchlistByID(username);
            res.status(200).json({
                success: true,
                watchlist: watchlist
            });
        }

        catch (error) {
            console.error('Error fetching watchlist:', error.message);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    static async createWatchlist(req, res) {
        try {
            const watchlistData = req.body;
            console.log(watchlistData);
            

            await WatchlistModel.createWatchlist(watchlistData);

            res.status(201).json({
                success: true,
                message: 'Watchlist created successfully'
            });
        }

        catch (error) {
            console.error('Error creating watchlist:', error.message);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    static async AddMediaToWatchList(req, res) {
        try {
            const mediaData = req.body;

            WatchlistModel.addMediaToWatchlist(mediaData);

            res.status(200).json({
                success: true,
                message: 'Media added to watchlist successfully'
            });
        }

        catch(error){
            console.error('Error adding media to watchlist:', error.message);

            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }
}

module.exports = WatchlistController