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
            console.log(`Fetched reviews for media ID ${mediaId}:`, result.rows);
            

            return result.rows;
        }
        
        catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    }


    static async createMovieReview(reviewData) {
        const { username, mediaid, comment, userrating, reviewdate } = reviewData;

        const query = `
            INSERT INTO MOVIEREVIEW (username, mediaid, comment, userrating, reviewdate)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const result = await db.query(query, [username, mediaid, comment, userrating, reviewdate]);

        return result.rowCount > 0;
    }

    static async deleteMovieReview(reviewData) {
        const { username, mediaid } = reviewData;

        const query = `
            DELETE FROM MOVIEREVIEW
            WHERE username = $1 AND mediaid = $2
        `;
        const result = await db.query(query, [username, mediaid]);

        return result.rowCount > 0;
    }

    static async updateMovieReview(reviewData) {
        const { username, mediaid, comment, userrating, reviewdate } = reviewData;

        const query = `
            UPDATE MOVIEREVIEW
            SET comment = $1, userrating = $2, reviewdate = $3
            WHERE username = $4 AND mediaid = $5
        `;
        const result = await db.query(query, [comment, userrating, reviewdate, username, mediaid]);

        return result.rowCount > 0;
    }
}


module.exports = reviewModel;