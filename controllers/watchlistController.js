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


    static async removeMediaFromWatchlist(req, res) {
        try {
            const { watchlistid, mediaid } = req.params;

            const result = await WatchlistModel.removeMediaFromWatchlist(watchlistid, mediaid);

            res.status(200).json({
                success: true,
                message: result.message
            });
        }

        catch (error) {
            console.error('Error removing media from watchlist:', error.message);

            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    static async updateWatchlist(req, res) {
        try {
            const wlData = req.body;

            const result = await WatchlistModel.updateWatchlist(wlData);

            res.status(200).json({
                success: true,
                message: result.message
            });
        }

        catch (error) {
            console.error('Error updating watchlist:', error.message);

            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    static async deleteWatchlist(req, res) {
        try {
            const { watchlistid } = req.params;

            const result = await WatchlistModel.deleteWatchlist(watchlistid);

            res.status(200).json({
                success: true,
                message: result.message
            });
        }

        catch (error) {
            console.error('Error deleting watchlist:', error.message);

            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    static async getWatchlistMedia(req, res) {
        try {
            const { watchlistid } = req.params;
            console.log(`Fetching media for watchlist ID: ${watchlistid}`);

            const mediaList = await WatchlistModel.getWatchlistMedia(watchlistid);

            res.status(200).json({
                success: true,
                mediaList
            });
        }

        catch (error) {
            console.error('Error fetching watchlist media:', error.message);

            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    static async toggleIsWatched(req, res) {
        try {
            const { watchlistid, mediaid } = req.params;

            const result = await WatchlistModel.toggleIsWatched(watchlistid, mediaid);

            res.status(200).json({
                success: true,
                message: result.message
            });
        }

        catch (error) {
            console.error('Error toggling watch status:', error.message);

            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    static async togglesWatched(req, res) {
        try {
            const { watchlistid } = req.params;
            const { mediaids } = req.body; // expects array of mediaids

            const result = await WatchlistModel.togglesWatched(watchlistid, mediaids);

            res.status(200).json({
                success: true,
                message: result.message
            });
        }
        catch (error) {
            console.error('Error toggling watch status for multiple media:', error.message);

            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

}

module.exports = WatchlistController