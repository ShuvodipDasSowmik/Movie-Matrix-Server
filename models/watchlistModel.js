const db = require('../config/database')

class WatchlistModel{
    static async getWatchlistByID(username){
        const getwlQuery = `SELECT watchlistid, title, iscomplete FROM WATCHLIST WHERE username = $1`;
        const wlResult = await db.query(getwlQuery, [username]);

        return wlResult.rows;
    }

    static async createWatchlist(wlData){
        const {title, username, medias} = wlData;
        
        const cwlQuery = `INSERT INTO WATCHLIST(username, title) VALUES ($1, $2) RETURNING watchlistid`;

        await Promise.all(
            medias.map(async (mediaid) => {
                const addMediaQuery = `INSERT INTO WATCHLIST(watchlistid, mediaid) VALUES ($1, $2)`;
                await db.query(addMediaQuery, [watchlistid, mediaid]);
            })
        );

        await db.query(cwlQuery, [username, title]);
    }

    static async addMediaToWatchlist(mediaData){
        const watchlistid = mediaData.watchlistid;
        const medias = mediaData.medias;

        await Promise.all(
            medias.map(async (mediaid) => {
                const addMediaQuery = `INSERT INTO WATCHLIST(watchlistid, mediaid) VALUES ($1, $2)`;
                await db.query(addMediaQuery, [watchlistid, mediaid]);
            })
        );
    }
}

module.exports = WatchlistModel;