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
        const movieAwardQuery = `SELECT ma.mediaid, a.awardname, a.awardcategory, ma.year FROM mediaaward ma JOIN award a ON ma.awardid = a.awardid WHERE ma.mediaid = $1`;

        const movieResult = await db.query(movieQuery, [mediaid]);
        const movieData = movieResult.rows[0];

        console.log('Movie Data, ', movieData);

        const movieActor = await db.query(movieActorQuery, [mediaid]);
        const movieStudio = await db.query(movieStudioQuery, [mediaid]);
        const movieGenre = await db.query(movieGenreQuery, [mediaid]);
        const movieDirector = await db.query(movieDirectorQuery, [mediaid]);
        const movieAward = await db.query(movieAwardQuery, [mediaid]);

        movieData.cast = movieActor.rows;
        movieData.studio = movieStudio.rows;
        movieData.director = movieDirector.rows;
        movieData.genre = movieGenre.rows;
        movieData.awards = movieAward.rows;

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
        const seasonsQuery = `SELECT * FROM SEASON WHERE mediaid = $1 ORDER BY seasonid ASC`;
        const seriesAwardQuery = `SELECT ma.mediaid, a.awardname, a.awardcategory, ma.year FROM mediaaward ma JOIN award a ON ma.awardid = a.awardid WHERE ma.mediaid = $1`;
        
        const seriesResult = await db.query(seriesQuery, [mediaid]);
        const seriesData = seriesResult.rows[0];

        // console.log('Series Data: ', seriesData);

        const seriesActor = await db.query(seriesActorQuery, [mediaid]);
        const seriesStudio = await db.query(seriesStudioQuery, [mediaid]);
        const seriesGenre = await db.query(seriesGenreQuery, [mediaid]);
        const seriesDirector = await db.query(seriesDirectorQuery, [mediaid]);
        const seasonsResult = await db.query(seasonsQuery, [mediaid]);
        const seriesAward = await db.query(seriesAwardQuery, [mediaid]);

        seriesData.cast = seriesActor.rows;
        seriesData.studio = seriesStudio.rows;
        seriesData.director = seriesDirector.rows;
        seriesData.genre = seriesGenre.rows;
        seriesData.seasons = seasonsResult.rows;
        seriesData.awards = seriesAward.rows;

        console.log("Seasons: ", seasonsResult.rows);

        return seriesData;
    }


    

    static async getEpisodesByID(seasonid) {
        const episodesQuery = `SELECT E.* FROM EPISODES E JOIN SEASON S ON (S.seasonid = E.seasonid) WHERE S.seasonid = $1`;


        const episodesResult = await db.query(episodesQuery, [seasonid]);
        const episodesData = episodesResult.rows;

        return episodesData;
    }

}

module.exports = MediaModel;