const db = require('./config/database');
const router = require('express').Router();


router.get('/adminStat', async (req, res) => {
    try{

        const statQuery = `
            SELECT
                COUNT(*) AS userCount,
                (SELECT COUNT(*) FROM ACTOR) AS actorCount,
                (SELECT COUNT(*) FROM DIRECTOR) AS directorCount,
                (SELECT COUNT(*) FROM STUDIO) AS studioCount,
                (SELECT COUNT(*) FROM MEDIA) AS mediaCount,
                (SELECT COUNT(*) FROM MOVIE) AS movieCount,
                (SELECT COUNT(*) FROM TVSERIES) AS seriesCount,
                (SELECT ROUND(AVG(EXTRACT(YEAR FROM AGE(CURRENT_DATE, DATE (DATEOFBIRTH)))), 2) FROM SYSTEMUSER) AS avgAge
            FROM
                USERS;
        `;

        const result = await db.query(statQuery);

        const statResult = result.rows[0];
        console.log(statResult);
        
        return res.status(200).json({
            message: 'Success',
            statResult
        });
    }

    catch(queryError) {
        console.error('Error fetching admin statistics:', queryError);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;