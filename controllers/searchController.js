const db = require('../config/database');

class SearchController {


    static async getCombinedSearch(req, res) {
        try {
            const keyword = req.params.keyword;
            const searchPattern = `%${keyword}%`;
            
            const actorQuery = `SELECT actorid, actorname, picture, nationality FROM ACTOR WHERE actorname ILIKE $1`;
            const mediaQuery = `SELECT mediaid, title, mediatype FROM MEDIA WHERE title ILIKE $1`;
            

            const [actorResult, mediaResult] = await Promise.all([
                db.query(actorQuery, [searchPattern]),
                db.query(mediaQuery, [searchPattern])
            ]);
            
            console.log(`Combined search query successful for "${keyword}"`);
            
            const actorSearch = actorResult.rows;
            const mediaSearch = mediaResult.rows;

            return res.status(200).json({
                message: 'success',
                keyword: keyword,
                results: {
                    actors: actorSearch,
                    media: mediaSearch
                },
                totalResults: actorSearch.length + mediaSearch.length
            });

        } catch (queryError) {
            console.error('Combined search error:', queryError);
            return res.status(500).json({
                message: 'Search failed',
                error: queryError.message
            });
        }
    }

    static async getActorBySearch(req, res) {
        try {
            const keyword = req.params.keyword;
            const actorQuery = `SELECT actorid, actorname, picture, nationality FROM ACTOR WHERE actorname ILIKE $1`;
            const searchPattern = `%${keyword}%`;
            
            const actorResult = await db.query(actorQuery, [searchPattern]);
            console.log(`ActorData Query Successful for ${keyword}`);
            const actorSearch = actorResult.rows;

            return res.status(200).json({
                message: 'success',
                actorSearch
            });

        } catch (queryError) {
            console.error('Actor search error:', queryError);
            return res.status(404).json({
                message: queryError.message
            });
        }
    }

    static async getMediaBySearch(req, res) {
        try {
            const keyword = req.params.keyword;
            const mediaQuery = `SELECT mediaid, title, mediatype FROM MEDIA WHERE title ILIKE $1`;
            const searchPattern = `%${keyword}%`;
            
            const mediaResult = await db.query(mediaQuery, [searchPattern]);
            console.log(`MediaData Query Successful for ${keyword}`);
            const mediaSearch = mediaResult.rows;

            return res.status(200).json({
                message: 'success',
                mediaSearch
            });

        } catch (queryError) {
            console.error('Actor search error:', queryError);
            return res.status(404).json({
                message: queryError.message
            });
        }
    }
}

module.exports = SearchController;