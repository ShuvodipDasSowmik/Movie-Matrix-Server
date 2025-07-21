const ReviewModel = require('../models/reviewModel');

class ReviewController {

    static async getMovieReviewByID(req, res) {
        const mediaId = req.params.mediaid;

        try {
            const reviews = await ReviewModel.getMovieReviewByID(mediaId);

            res.status(200).json({
                message: 'Success',
                reviews
            });
        }
        
        catch (error) {
            console.error('Error fetching reviews:', error);
            
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    static async createMovieReview(req, res) {
        const reviewData = req.body;

        console.log(reviewData);
        
        try {
            const success = await ReviewModel.createMovieReview(reviewData);

            if (success) {
                res.status(200).json({
                    message: 'Review created successfully'
                });
            }
            else {
                res.status(400).json({
                    message: 'Failed to create review'
                });
            }
        }
        
        catch (error) {
            console.error('Error creating review:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async deleteMovieReview(req, res) {
        const reviewData = req.body;

        try {
            const success = await ReviewModel.deleteMovieReview(reviewData);

            if (success) {
                res.status(200).json({
                    message: 'Review deleted successfully'
                });
            }
            else {
                res.status(400).json({
                    message: 'Failed to delete review'
                });
            }
        }
        
        catch (error) {
            console.error('Error deleting review:', error);

            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    static async updateMovieReview(req, res) {
        const reviewData = req.body;

        try {
            const success = await ReviewModel.updateMovieReview(reviewData);

            if (success) {
                res.status(200).json({
                    message: 'Review updated successfully'
                });
            }
            else {
                res.status(400).json({
                    message: 'Failed to update review'
                });
            }
        }
        
        catch (error) {
            console.error('Error updating review:', error);

            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    static async getEpisodeReviewByID(req, res) {
        const seasonId = req.params.seasonid;

        try {
            const reviews = await ReviewModel.getEpisodeReviewBySeasonID(seasonId);

            res.status(200).json({
                message: 'Success',
                reviews
            });
        }
        
        catch (error) {
            console.error('Error fetching episode reviews:', error);
            
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    static async createEpisodeReview(req, res) {
        const reviewData = req.body;

        try {
            const success = await ReviewModel.createEpisodeReview(reviewData);

            if (success) {
                res.status(200).json({
                    message: 'Episode review created successfully'
                });
            }
            else {
                res.status(400).json({
                    message: 'Failed to create episode review'
                });
            }
        }
        
        catch (error) {
            console.error('Error creating episode review:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async updateEpisodeReview(req, res) {
        const reviewData = req.body;

        try {
            const success = await ReviewModel.updateEpisodeReview(reviewData);

            if (success) {
                res.status(200).json({
                    message: 'Episode review updated successfully'
                });
            }
            else {
                res.status(400).json({
                    message: 'Failed to update episode review'
                });
            }
        }
        
        catch (error) {
            console.error('Error updating episode review:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async deleteEpisodeReview(req, res) {
        const reviewData = req.body;

        console.log('reviewData:', reviewData);
        

        try {
            const success = await ReviewModel.deleteEpisodeReview(reviewData);

            if (success) {
                res.status(200).json({
                    message: 'Episode review deleted successfully'
                });
            }
            else {
                res.status(400).json({
                    message: 'Failed to delete episode review'
                });
            }
        }
        
        catch (error) {
            console.error('Error deleting episode review:', error);

            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

}

module.exports = ReviewController;