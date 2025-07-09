const db = require('../config/database')

class WatchlistModel{
    static async getWatchlistByID(username){
        const getwlQuery = `SELECT watchlistid, title, iscomplete FROM WATCHLIST WHERE username = $1`;
        const wlResult = await db.query(getwlQuery, [username]);

        return wlResult.rows;
    }

    static async createWatchlist(wlData){
        const {title, username} = wlData;
        
        const cwlQuery = `INSERT INTO WATCHLIST(username, title) VALUES ($1, $2)`;

        await db.query(cwlQuery, [username, title]);
    }

    static async addMediaToWatchlist(mediaid){
        
    }
}