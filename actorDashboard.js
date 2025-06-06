const express = require('express');
const db = require('./database');
const router = express.Router();

router.get('/actors/:actorname', async (req, res) => {

    const actorname = req.params.actorname;
    console.log(actorname);
    
    const actorQuery = `SELECT * FROM ACTOR WHERE actorname = $1`;
    const actorMediasQuery = `Select ME.mediaid, title, releaseyear, poster FROM MEDIA ME JOIN MEDIAACTOR MA ON (ME.mediaid = MA.mediaid) WHERE actorid = (SELECT actorid FROM ACTOR WHERE actorname = $1)`

    try{

        const actorResult = await db.query(actorQuery, [actorname]);
        console.log(`ActorData Query Successful for ${actorname}`);

        const actorMediaResult = await db.query(actorMediasQuery, [actorname]);
        console.log(`ActorMedia Query Successful for ${actorname}`);
        
        const actorData = actorResult.rows[0];

        console.log(actorMediaResult.rows);
        
        actorData.medias = actorMediaResult.rows;

        console.log(actorData);
        

        res.status(200).json({
            message: 'Success',
            actorData
        })

    }catch(queryError){

        console.log(`Query Failed for ${actorname}: ${queryError.message}`);
        
        res.status(404).json({
            message: queryError.message
        })

    }
})


module.exports = router;