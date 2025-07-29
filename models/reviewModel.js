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


    static async getEpisodeReviewBySeasonID(seasonId) {
        try {
            const query = `
                SELECT
                    username,
                    comment,
                    userrating,
                    reviewdate,
                    episodeid,
                    reviewid,
                    seasonid
                FROM
                    EPISODEREVIEW
                WHERE
                    seasonid = $1
            `;

            const result = await db.query(query, [seasonId]);
            console.log(`Fetched series reviews for season ID ${seasonId}:`, result.rows);
            
            return result.rows;
        }
        
        catch (error) {
            console.error('Error fetching series reviews by season ID:', error);
            throw error;
        }
    }

    static async createEpisodeReview(reviewData) {
        const { username, episodeid, comment, userrating, reviewdate, seasonid } = reviewData;

        const query = `
            INSERT INTO EPISODEREVIEW (username, episodeid, comment, userrating, reviewdate, seasonid)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const result = await db.query(query, [username, episodeid, comment, userrating, reviewdate, seasonid]);

        return result.rowCount > 0;
    }

    static async deleteEpisodeReview(reviewData) {
        const { username, episodeid } = reviewData;

        const query = `
            DELETE FROM EPISODEREVIEW
            WHERE username = $1 AND episodeid = $2
        `;
        const result = await db.query(query, [username, episodeid]);

        return result.rowCount > 0;
    }

    static async updateEpisodeReview(reviewData) {
        const { username, episodeid, comment, userrating, reviewdate } = reviewData;

        const query = `
            UPDATE EPISODEREVIEW
            SET comment = $1, userrating = $2, reviewdate = $3
            WHERE username = $4 AND episodeid = $5
        `;
        const result = await db.query(query, [comment, userrating, reviewdate, username, episodeid]);

        return result.rowCount > 0;
    }
}


module.exports = reviewModel;


// Num of Queries = 8 [Simple = 8]