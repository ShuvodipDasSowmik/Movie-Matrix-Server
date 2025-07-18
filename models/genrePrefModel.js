const db = require('../config/database')

class genrePrefModel {

    static async getGenrePrefByID(username){
        const getGenreQuery = `SELECT G.genreid, G.genrename FROM GENRE G JOIN GENREPREFERENCE GF ON (GF.genreid = G.genreid) WHERE GF.username = $1`;
        const genreResult = await db.query(getGenreQuery, [username]);
        return genreResult.rows;
    }

    static async addGenrePref(genreData) {
        const {username, genreid} = genreData;
        
        // Check if preference already exists
        const checkQuery = `SELECT * FROM GENREPREFERENCE WHERE username = $1 AND genreid = $2`;
        const existing = await db.query(checkQuery, [username, genreid]);
        
        if (existing.rows.length > 0) {
            throw new Error('Genre preference already exists');
        }

        const addGenreQuery = `INSERT INTO GENREPREFERENCE(username, genreid) VALUES ($1, $2) RETURNING *`;
        const addGenreResult = await db.query(addGenreQuery, [username, genreid]);
        return addGenreResult.rows[0];
    }
    
    static async removeGenrePref(username, genreid){
        const deleteQuery = `DELETE FROM GENREPREFERENCE WHERE username = $1 AND genreid = $2`;
        await db.query(deleteQuery, [username, genreid]);
    }

    static async getAllGenres(){
        const getGenresQuery = `SELECT genreid, genrename FROM GENRE ORDER BY genrename`;
        const genresResult = await db.query(getGenresQuery);
        return genresResult.rows;
    }
}

module.exports = genrePrefModel;