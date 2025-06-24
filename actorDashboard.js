// const express = require('express');
// const db = require('./config/database');
// const router = express.Router();

// router.get('/actors/:actorid', async (req, res) => {

//     const actorid = req.params.actorid;
//     console.log(actorid);
    
//     const actorQuery = `SELECT * FROM ACTOR WHERE actorid = $1`;

//     // Use of Advance SQL [JOIN Statements and Sub Queries]
//     const actorMediasQuery = `Select ME.mediaid, title, releaseyear, poster FROM MEDIA ME JOIN MEDIAACTOR MA ON (ME.mediaid = MA.mediaid) WHERE actorid = $1`

//     try{

//         const actorResult = await db.query(actorQuery, [actorid]);
//         console.log(`ActorData Query Successful for ${actorResult.actorname}`);

//         const actorMediaResult = await db.query(actorMediasQuery, [actorid]);
//         console.log(`ActorMedia Query Successful for ${actorResult.actorname}`);
        
//         const actorData = actorResult.rows[0];

//         console.log(actorMediaResult.rows);
        
//         actorData.medias = actorMediaResult.rows;

//         console.log(actorData);
        

//         res.status(200).json({
//             message: 'Success',
//             actorData
//         })

//     }
    
//     catch(queryError){
//         console.log(`Query Failed for ${actorid}: ${queryError.message}`);
        
//         res.status(404).json({
//             message: queryError.message
//         })

//     }
// })


// router.get('/actors', async(req, res) => {
//     const actorsQuery = `SELECT actorid, actorname, picture, nationality FROM ACTOR`;
    
//     try{
//         const actorsResult = await db.query(actorsQuery);
//         const actorsData = actorsResult.rows;

//         console.log(actorsData);

//         res.status(200).json({
//             message: 'Success',
//             actorsData
//         });

//     }catch(queryError){
//         console.log('Actors Data failed to fetch from Database');
        
//         res.status(404).json({
//             message: queryError.message
//         })
//     }

// })


// module.exports = router;