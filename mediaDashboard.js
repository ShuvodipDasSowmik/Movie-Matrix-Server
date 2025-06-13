const express = require('express');
const db = require('./database');
const router = express.Router();

router.get('/movies', async(req, res) => {
    const moviesQuery = `SELECT mediaid, language, title, releaseyear, poster, overallrating, pgrating FROM MEDIA WHERE mediatype = \'movie\'`;

    try {
        const movieResult = await db.query(moviesQuery);
        
        const movieData = movieResult.rows;

        console.log(`Query Successful`);
        console.log(movieData);

        return res.status(200).json({
            message: 'Success',
            movieData
        });
        
    } catch (queryError) {
        console.log(`Query Failed`);
        
        return res.status(404).json({
            message: queryError.message
        })
    }
});

router.get('/movie/:mediaid', async(req, res) => {
    const mediaid = req.params.mediaid;

    console.log('Request Recieved for MediaId ', mediaid);
    
    // These 2 queries may be able to merge

    // Also add Studios from MediaStudio, Award from MediaAward, Director from MediaDirector, Genre from MediaGenre
    const movieQuery = `SELECT M.*, MO.duration FROM MEDIA M JOIN MOVIE MO ON (M.mediaid = MO.mediaid) WHERE M.mediaid = $1`;
    const movieActorQuery = `SELECT MA.actorid, actorname, picture FROM ACTOR A JOIN MEDIAACTOR MA ON (A.actorid = MA.actorid) WHERE MA.mediaid = $1`;

    try {

        const movieResult = await db.query(movieQuery, [mediaid]);
        const movieData = movieResult.rows[0];
        console.log('MovieResult ', movieData);


        const movieActorResult = await db.query(movieActorQuery, [mediaid]);
        console.log('Movie Actor Result ', movieActorResult);
        const movieActorData = movieActorResult.rows;
        
        movieData.cast = movieActorData;

        console.log(movieData);
        
        res.status(200).json({
            message: 'Success',
            movieData
        })
        
    } catch (queryError) {
        console.error(`Query Failed `, queryError.message);
        
        res.status(404).json({
            message: queryError.message
        })
    }
})


router.get('/series', async(req, res) => {
    const seriesQuery = `SELECT mediaid, language, title, releaseyear, poster, overallrating, pgrating FROM MEDIA WHERE mediatype = \'series\'`;

    try {
        const seriesResult = await db.query(seriesQuery);
        
        const seriesData = seriesResult.rows;

        console.log(`Query Successful`);
        console.log(seriesData);

        return res.status(200).json({
            message: 'Success',
            seriesData
        });
        
    } catch (queryError) {
        console.log(`Query Failed`);
        
        return res.status(404).json({
            message: queryError.message
        })
    }
});


module.exports = router