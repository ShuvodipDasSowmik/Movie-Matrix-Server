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
        
        // First create the watchlist and get the ID
        const result = await db.query(cwlQuery, [username, title]);
        const watchlistid = result.rows[0].watchlistid;
        
        // Then add media to the watchlist
        if (medias && medias.length > 0) {
            await Promise.all(
                medias.map(async (mediaid) => {
                    const addMediaQuery = `INSERT INTO WATCHLISTMEDIA(watchlistid, mediaid) VALUES ($1, $2)`;
                    await db.query(addMediaQuery, [watchlistid, mediaid]);
                })
            );
        }
        
        return watchlistid;
    }

    static async addMediaToWatchlist(mediaData){
        try {
            const watchlistid = mediaData.watchlistid;
            const medias = mediaData.medias;

            await Promise.all(
                medias.map(async (mediaid) => {
                    const addMediaQuery = `INSERT INTO WATCHLISTMEDIA(watchlistid, mediaid) VALUES ($1, $2)`;
                    await db.query(addMediaQuery, [watchlistid, mediaid]);
                })
            );
            
            return {
                success: true,
                message: `${medias.length} media items added to watchlist ${watchlistid}`
            };
        }
        
        catch (error) {
            console.log(`Error adding media to watchlist: ${error.message}`);

            throw new Error(`Media Already Exists In Watchlist`);
        }
    }

    static async removeMediaFromWatchlist(watchlistid, mediaid) {

        const removeMediaQuery = `DELETE FROM WATCHLISTMEDIA WHERE watchlistid = $1 AND mediaid = $2`;
        await db.query(removeMediaQuery, [watchlistid, mediaid]);

        return {
            success: true,
            message: `Media ${mediaid} removed from watchlist ${watchlistid}`
        };
    }

    static async updateWatchlist(wlData) {
        const { watchlistid, title, iscomplete } = wlData;

        const updateQuery = `
            UPDATE WATCHLIST
            SET title = $1, iscomplete = $2
            WHERE watchlistid = $3
        `;
        await db.query(updateQuery, [title, iscomplete, watchlistid]);

        return {
            success: true,
            message: `Watchlist ${watchlistid} updated successfully`
        };
    }

    static async deleteWatchlist(watchlistid) {
        const deleteQuery = `DELETE FROM WATCHLIST WHERE watchlistid = $1`;
        await db.query(deleteQuery, [watchlistid]);

        return {
            success: true,
            message: `Watchlist ${watchlistid} deleted successfully`
        };
    }

    static async getWatchlistMedia(watchlistid) {
        console.log(`Fetching media for watchlist ID: ${watchlistid}`);
        
        const mediaQuery = `
            SELECT m.mediaid, m.title, m.language, m.releaseyear, m.poster, 
                   m.overallrating, m.pgrating, m.description, m.trailerlink, m.mediatype,
                   wm.iswatched
            FROM WATCHLISTMEDIA wm
            JOIN MEDIA m ON wm.mediaid = m.mediaid
            WHERE wm.watchlistid = $1
        `;
        const result = await db.query(mediaQuery, [watchlistid]);

        console.log(result.rows);
        

        return result.rows;
    }


    static async toggleIsWatched(watchlistid, mediaids) {

        await Promise.all(
            mediaids.map(async (mediaid) => {
                const toggleQuery = `
                    UPDATE WATCHLISTMEDIA
                    SET iswatched = NOT iswatched
                    WHERE watchlistid = $1 AND mediaid = $2
                `;
                await db.query(toggleQuery, [watchlistid, mediaid]);
            })
        );

        return {
            success: true,
            message: `Watch status toggled for ${mediaids.length} media items in watchlist ${watchlistid}`
        };
    }
}

module.exports = WatchlistModel;


// Num of Queries = 8 [Simple = 7] [Advance = 1]