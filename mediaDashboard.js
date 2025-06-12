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