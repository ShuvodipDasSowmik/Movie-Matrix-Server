const db = require('../config/database');

class reviewModel {
    static async getMovieReviewByID(mediaId) {
        try {
            const query = `
                SELECT
                    username,
                    comment,
                    userrating,
                    reviewdate
                FROM
                    MOVIEREVIEW
                WHERE
                    mediaid = $1
            `;
            const result = await db.query(query, [mediaId]);

            return result.rows;
        }
        
        catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    }
}


module.exports = reviewModel;