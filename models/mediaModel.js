const db = require('../config/database');


class MediaModel {

    static async getAllMovies() {
        const moviesQuery = `SELECT mediaid, language, title, releaseyear, poster, overallrating, pgrating FROM MEDIA WHERE mediatype = \'movie\'`;


        const movieResult = await db.query(moviesQuery);
        const movieData = movieResult.rows;

        console.log(`Query Successful`);
        console.log(movieData);

        return movieData;
    }

    static async getMovieByID(mediaid) {

        // Use Of SUB-QUERIES
        const movieQuery = `SELECT M.*, MO.duration FROM MEDIA M JOIN MOVIE MO ON (M.mediaid = MO.mediaid) WHERE M.mediaid = $1`;
        const movieActorQuery = `SELECT MA.actorid, actorname, picture FROM ACTOR A JOIN MEDIAACTOR MA ON (A.actorid = MA.actorid) WHERE MA.mediaid = $1`;
        const movieStudioQuery = `SELECT MS.studioid, studioname, picture FROM STUDIO S JOIN MEDIASTUDIO MS ON (MS.studioid = S.studioid) WHERE MS.mediaid = $1`;
        const movieGenreQuery = `SELECT MG.genreid, genrename FROM GENRE G JOIN MEDIAGENRE MG ON (MG.genreid = G.genreid) WHERE MG.mediaid = $1`;
        const movieDirectorQuery = `SELECT MD.directorid, directorname, picture FROM DIRECTOR D JOIN MEDIADIRECTOR MD ON (MD.directorid = D.directorid) WHERE MD.mediaid = $1`;


        const movieResult = await db.query(movieQuery, [mediaid]);
        const movieData = movieResult.rows[0];

        console.log('Movie Data, ', movieData);

        const movieActor = await db.query(movieActorQuery, [mediaid]);
        const movieStudio = await db.query(movieStudioQuery, [mediaid]);
        const movieGenre = await db.query(movieGenreQuery, [mediaid]);
        const movieDirector = await db.query(movieDirectorQuery, [mediaid]);

        movieData.cast = movieActor.rows;
        movieData.studio = movieStudio.rows;
        movieData.director = movieDirector.rows;
        movieData.genre = movieGenre.rows;

        console.log(movieData);

        return movieData;
    }

    static async getAllSeries() {
        const seriesQuery = `SELECT mediaid, language, title, releaseyear, poster, overallrating, pgrating FROM MEDIA WHERE mediatype = \'series\'`;


        const seriesResult = await db.query(seriesQuery);
        const seriesData = seriesResult.rows;

        return seriesData;
    }

    static async getSeriesByID(mediaid) {
        // Use Of SUB-QUERIES
        const seriesQuery = `SELECT M.*, S.isongoing FROM MEDIA M JOIN TVSERIES S ON (M.mediaid = S.mediaid) WHERE M.mediaid = $1`;
        const seriesActorQuery = `SELECT MA.actorid, actorname, picture FROM ACTOR A JOIN MEDIAACTOR MA ON (A.actorid = MA.actorid) WHERE MA.mediaid = $1`;
        const seriesStudioQuery = `SELECT MS.studioid, studioname, picture FROM STUDIO STU JOIN MEDIASTUDIO MS ON (MS.studioid = STU.studioid) WHERE MS.mediaid = $1`;
        const seriesGenreQuery = `SELECT MG.genreid, genrename FROM GENRE G JOIN MEDIAGENRE MG ON (MG.genreid = G.genreid) WHERE MG.mediaid = $1`;
        const seriesDirectorQuery = `SELECT MD.directorid, directorname, picture FROM DIRECTOR D JOIN MEDIADIRECTOR MD ON (MD.directorid = D.directorid) WHERE MD.mediaid = $1`;

        const seriesResult = await db.query(seriesQuery, [mediaid]);
        const seriesData = seriesResult.rows[0];

        console.log('Series Data: ', seriesData);

        const seriesActor = await db.query(seriesActorQuery, [mediaid]);
        const seriesStudio = await db.query(seriesStudioQuery, [mediaid]);
        const seriesGenre = await db.query(seriesGenreQuery, [mediaid]);
        const seriesDirector = await db.query(seriesDirectorQuery, [mediaid]);

        seriesData.cast = seriesActor.rows;
        seriesData.studio = seriesStudio.rows;
        seriesData.director = seriesDirector.rows;
        seriesData.genre = seriesGenre.rows;

        console.log(seriesData);

        return seriesData;
    }


    static async getSeriesByID(mediaid) {
        // Use Of SUB-QUERIES
        const seriesQuery = `SELECT M.*, S.isongoing FROM MEDIA M JOIN TVSERIES S ON (M.mediaid = S.mediaid) WHERE M.mediaid = $1`;
        const seriesActorQuery = `SELECT MA.actorid, actorname, picture FROM ACTOR A JOIN MEDIAACTOR MA ON (A.actorid = MA.actorid) WHERE MA.mediaid = $1`;
        const seriesStudioQuery = `SELECT MS.studioid, studioname, picture FROM STUDIO STU JOIN MEDIASTUDIO MS ON (MS.studioid = STU.studioid) WHERE MS.mediaid = $1`;
        const seriesGenreQuery = `SELECT MG.genreid, genrename FROM GENRE G JOIN MEDIAGENRE MG ON (MG.genreid = G.genreid) WHERE MG.mediaid = $1`;
        const seriesDirectorQuery = `SELECT MD.directorid, directorname, picture FROM DIRECTOR D JOIN MEDIADIRECTOR MD ON (MD.directorid = D.directorid) WHERE MD.mediaid = $1`;

        const seriesResult = await db.query(seriesQuery, [mediaid]);
        const seriesData = seriesResult.rows[0];

        console.log('Series Data: ', seriesData);

        const seriesActor = await db.query(seriesActorQuery, [mediaid]);
        const seriesStudio = await db.query(seriesStudioQuery, [mediaid]);
        const seriesGenre = await db.query(seriesGenreQuery, [mediaid]);
        const seriesDirector = await db.query(seriesDirectorQuery, [mediaid]);

        seriesData.cast = seriesActor.rows;
        seriesData.studio = seriesStudio.rows;
        seriesData.director = seriesDirector.rows;
        seriesData.genre = seriesGenre.rows;

        console.log(seriesData);

        return seriesData;
    }



}

module.exports = MediaModel;