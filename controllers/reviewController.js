const ReviewModel = require('../models/reviewModel');

class ReviewController {

    static async getMovieReviewByID(req, res) {
        const mediaId = req.params.mediaId;
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

        try {
            const success = await ReviewModel.createMovieReview(reviewData);

            if (success) {
                res.status(201).json({
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

}

module.exports = ReviewController;