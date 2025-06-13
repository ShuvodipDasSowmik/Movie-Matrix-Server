const express = require('express');
const db = require('./database');
const router = express.Router();

router.post('/admin', async (req, res) => {

    const reqData = req.body;

    try {
        console.log('Received admin entry request:', reqData);

        if (reqData.dataType == 'genre') {
            const genreQuery = `INSERT INTO GENRE (genrename) VALUES ($1)`
            const genreValues = reqData.data;

            try {
                const results = await Promise.all(
                    genreValues.map(async (value) => {
                        try {
                            const result = await db.query(genreQuery, [value.GenreName]);

                            console.log(`Query Successful for: ${value.GenreName}`);

                            return {
                                success: true,
                                result: result
                            };
                        } catch (queryError) {
                            console.error(`Error Inserting Genre ${value.GenreName}: ${queryError}`);
                            return {
                                success: false,
                                result: queryError.message
                            }
                        }
                    })
                );

                const failures = results.filter(result => !result.success)

                if (failures.length > 0) {

                    // res.status(207) -- Partially Success

                    return res.status(207).json({
                        message: 'Some genres could not be inserted',
                        success: results.filter(result => result.success),
                        failures: failures
                    });
                }

                console.log(`Genre Data Insertion Successful`)

                return res.status(200).json({ message: 'Success', results });

            } catch (promiseError) {
                console.error('Error Processing Genre Queries: ', promiseError);

                // res.status(500) -- Internal Server Error that aren't related to user input
                return res.status(500).json({
                    message: 'Failed to process Genre Insertions',
                    error: promiseError.message
                })
            }

        }

        else if (reqData.dataType === 'studio') {

            try {
                const studioQuery = `INSERT INTO STUDIO (studioname, foundingyear, location) VALUES ($1, $2, $3)`;
                const studioData = reqData.data;

                const results = await Promise.all(
                    studioData.map(async (value) => {

                        try {
                            const result = await db.query(studioQuery, [value.StudioName, value.FoundingYear, value.Location]);

                            console.log(`Query Successful for: ${value.StudioName}`);

                            return {
                                success: true,
                                result: result
                            }
                        } catch (queryError) {

                            console.log(`Error inserting studio ${value.StudioName}`);

                            return {
                                success: false,
                                result: queryError.message
                            }
                        }

                    })
                );

                const failures = results.filter(result => !result.success);

                if (failures.length > 0) {

                    return res.status(207).json({
                        message: 'Some studios could not be inserted',
                        success: results.filter(result => result.success),
                        failures: failures
                    });
                }

                console.log(`Data Insertion Successful`);

                return res.status(200).json({ message: 'Success', results });

            } catch (promiseError) {
                console.error(`Error Processing Studio Queries`);

                return res.status(500).json({
                    message: 'Failed to process Studio insertions',
                    error: promiseError.message
                })
            }
        }

        else if (reqData.dataType === 'actor') {

            // Constraint in Actor Table: unique_director_fields (actorname, nationality, dob)
            // All rows must have unique combination of these fields

            try {
                const actorQuery = `INSERT INTO ACTOR (actorname, biography, nationality, dob) VALUES ($1, $2, $3, $4)`;
                const actorData = reqData.data;

                const results = await Promise.all(
                    actorData.map(async (value) => {
                        try {
                            const result = await db.query(actorQuery, [value.ActorName, value.Biography, value.Nationality, value.DOB]);

                            console.log(`Query successful for: ${value.ActorName}`);

                            return {
                                success: true,
                                result: result
                            }
                        } catch (queryError) {

                            console.log(`Query Failed For: ${value.ActorName}`);

                            return {
                                success: false,
                                result: queryError.message
                            }
                        }
                    })
                );

                const failures = results.filter(result => !result.success);

                if (failures.length > 0) {

                    return res.status(207).json({
                        message: 'Some Actor Data could not be inserted',
                        success: results.filter(result => result.success),
                        failures: failures
                    })
                }

                console.log('Data Insertion Successful');

                return res.status(200).json({
                    message: 'Success',
                    results
                })

            } catch (promiseError) {

                console.log('Error Processing Actor Queries');

                return res.status(500).json({
                    message: 'Failed to process Actor insertions',
                    error: promiseError.message
                })
            }

        }

        else if (reqData.dataType === 'director') {

            // Constraint in Director Table: unique_director_fields (directorname, nationality, dob)
            // All rows must have unique combination of these fields

            try {
                const directorQuery = `INSERT INTO DIRECTOR (directorname, biography, nationality, dob) VALUES ($1, $2, $3, $4)`;
                const directorData = reqData.data;

                const results = await Promise.all(
                    directorData.map(async (value) => {
                        try {
                            const result = await db.query(directorQuery, [value.DirectorName, value.Biography, value.Nationality, value.DOB]);

                            console.log(`Query successful for: ${value.DirectorName}`);

                            return {
                                success: true,
                                result: result
                            }
                        } catch (queryError) {

                            console.log(`Query Failed For: ${value.DirectorName}`);

                            return {
                                success: false,
                                result: queryError.message
                            }
                        }
                    })
                );

                const failures = results.filter(result => !result.success);

                if (failures.length > 0) {

                    return res.status(207).json({
                        message: 'Some Director Data could not be inserted',
                        success: results.filter(result => result.success),
                        failures: failures
                    })

                }

                console.log('Data Insertion Successful');

                return res.status(200).json({
                    message: 'Success',
                    results
                })

            } catch (promiseError) {

                console.log('Error Processing Director Queries');

                return res.status(500).json({
                    message: 'Failed to process Director insertions',
                    error: promiseError.message
                })
            }
        }

        else if (reqData.dataType === 'media') {

            try {
                const mediaData = reqData.data;
                const mediaQuery = `INSERT INTO MEDIA (title, releaseyear, description, language, pgrating, trailerlink, mediatype)
                                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                                    RETURNING mediaid`;

                // Constraint in Media Table: unique_media_fields (title, releaseyear, language, pgrating, mediatype)
                // All rows must have unique combination of these fields

                const results = await Promise.all(
                    mediaData.map(async (value) => {
                        try {
                            const result = await db.query(mediaQuery, [
                                value.title,
                                value.releaseyear,
                                value.description,
                                value.language,
                                value.pgrating,
                                value.trailerlink,
                                value.mediatype
                            ]);

                            const mediaid = result.rows[0].mediaid;

                            if (value.mediatype.toLowerCase() === 'movie') {

                                const mediaTypeQuery = `INSERT INTO MOVIE (mediaid, duration) VALUES ($1, $2)`;
                                await db.query(mediaTypeQuery, [mediaid, value.duration]);

                            }

                            else if (value.mediatype.toLowerCase() === 'series') {

                                const mediaTypeQuery = `INSERT INTO TVSERIES (mediaid, isongoing) VALUES ($1, $2)`;
                                await db.query(mediaTypeQuery, [mediaid, value.isongoing]);

                            }

                            console.log(`Query Successful for ${value.title}`);
                            return { success: true, result: value.title };

                        } catch (err) {
                            console.error(`Failed to insert ${value.title}:`, err.message);
                            return { success: false, result: err.message };
                        }
                    })
                );

                const failures = results.filter(result => !result.success);

                if (failures.length > 0) {
                    return res.status(207).json({
                        message: 'Some Media could not be inserted',
                        success: results.filter(r => r.success),
                        failures
                    });
                }

                return res.status(200).json({
                    message: 'All media inserted successfully',
                    results
                });

            } catch (promiseError) {
                console.error('Error Processing Media Queries', promiseError);
                return res.status(500).json({
                    message: 'Failed to process Media Data Insertion',
                    error: promiseError.message
                });
            }
        }

        else if (reqData.dataType === 'mediaactor') {

            const mediaActorData = reqData.data;

            // SUB QUERIES
            const mediaActorQuery = `INSERT INTO MEDIAACTOR (mediaid, actorid) VALUES ((SELECT mediaid FROM MEDIA WHERE title = $1), (SELECT actorid FROM ACTOR WHERE actorname = $2))`;

            try {
                const results = await Promise.all(
                    mediaActorData.map(async (value) => {

                        try {
                            const result = await db.query(mediaActorQuery, [value.Media, value.Actor]);
                            console.log(`Query Successful for ${value.Media} and ${value.Actor}`);

                            return {
                                success: true,
                                result: result
                            }
                        } catch (queryError) {
                            console.log(`Query Failed for ${value.Media} and ${value.Actor}: ${queryError.message}`);

                            return {
                                success: false,
                                result: queryError.message
                            }
                        }
                    })
                );

                const failures = results.filter(result => !result.success);

                if (failures.length > 0) {

                    return res.status(207).json({
                        message: 'Some Movie Actor Mapping Data could not be inserted',
                        success: results.filter(result => result.success),
                        failures: failures
                    })
                }

                console.log('Data Insertion Successful');

                return res.status(200).json({
                    message: 'Success',
                    results
                })
            } catch (promiseError) {
                console.log('Error Processing Media Actor Mapping Queries');

                return res.status(500).json({
                    message: 'Failed to process Media Actor Data Insertions',
                    error: promiseError.message
                })
            }
        }

        else if(reqData.dataType === 'mediadirector'){
            const mediaDirectorData = reqData.data;

            // Sub QUERIES
            const mediaDirectorQuery = `INSERT INTO MEDIADIRECTOR (mediaid, directorid) VALUES ((SELECT mediaid FROM MEDIA WHERE title = $1), (SELECT directorid FROM DIRECTOR WHERE directorname = $2))`;

            try {               
                const results = await Promise.all(
                    mediaDirectorData.map(async(value) => {
                        try {
                            const result = await db.query(mediaDirectorQuery, [value.media, value.director]);

                            console.log(`Query Successful for ${value.media} and ${value.director}`);

                            return{
                                success: true,
                                result: result
                            }
                        } catch (queryError) {
                            console.log(`Query Failed for ${value.media} and ${value.director}`);

                            return{
                                success: false,
                                result: queryError.message
                            }
                        }
                    })
                )

                const failures = results.filter(result => !result.success);

                if(failures.length > 0){
                    return res.status(207).json({
                        message: 'Some Media Director Mapping Data Insertion Not Successful',
                        success: results.filter(result => result.success),
                        failures: failures
                    })
                }

                console.log('Data Insertion Successful');
                
                return res.status(200).json({
                    message: 'Success',
                    results
                })

            } catch (promiseError) {
                console.log('Error Processing Media Director Queries');

                res.status(500).json({
                    message: 'Failed to process Media Director Data Insertion',
                    error: promiseError.message
                })
            }
        }

        else if(reqData.dataType === 'mediastudio'){
            const mediaStudioData = reqData.data;

            const mediaStudioQuery = `INSERT INTO MEDIASTUDIO (mediaid, studioid) VALUES ((SELECT mediaid FROM MEDIA WHERE title = $1), (SELECT studioid FROM STUDIO WHERE studioname = $2))`;

            try {
                const results = await Promise.all(
                    mediaStudioData.map(async(value) => {
                        try {
                            const result = await db.query(mediaStudioQuery, [value.Media, value.Studio]);

                            console.log(`Query Successful for ${value.Media} and ${value.Studio}`);
                            
                            return{
                                success: true,
                                result: result
                            }

                        } catch (queryError) {
                            console.log(`Query Failed for ${value.Media} and ${value.Studio}`);

                            return{
                                success: false,
                                result: queryError.message
                            }                            
                        }
                    })
                )

                const failures = results.filter(result => !result.success);

                if(failures.length > 0){
                    return res.status(207).json({
                        message: 'Some Media Studio Mapping Data Insertion Not Successful',
                        success: results.filter(result => result.success),
                        failures: failures
                    })
                }

                console.log('Data Insertion Successful');

                return res.status(200).json({
                    message: 'Success',
                    results
                })
                
            } catch (promiseError) {
                console.log('Error Processing Media Studio Data');

                return res.status(500).json({
                    message: 'Failed to process Media Studio Mapping Data Insertion',
                    error: promiseError.message
                })
            }
        }

        else if(reqData.dataType === 'mediagenre'){
            const mediaGenreData = reqData.data;

            const mediaGenreQuery = `INSERT INTO MEDIAGENRE (mediaid, genreid) VALUES ((SELECT mediaid FROM MEDIA WHERE title = $1),(SELECT genreid FROM GENRE WHERE genrename = $2))`;

            try {
                const results = await Promise.all(
                    mediaGenreData.map(async(value) => {
                        try {
                            const result = await db.query(mediaGenreQuery, [value.media, value.genre]);

                            console.log(`Query Successful for ${value.media} and ${value.genre}`);
                            
                            return{
                                success: true,
                                result: result
                            }

                        } catch (queryError) {
                            console.log(`Query Failed for ${value.media} and ${value.genre}`);

                            return{
                                success: false,
                                result: queryError.message
                            } 
                        }

                        
                    })
                )

                const failures = results.filter(result => !result.success);

                if(failures.length > 0){
                    return res.status(207).json({
                        message: 'Some Media Genre Mapping Data Insertion Not Successful',
                        success: results.filter(result => result.success),
                        failures: failures
                    })
                }

                console.log('Data Insertion Successful');

                return res.status(200).json({
                    message: 'Success',
                    results
                })

            } catch (promiseError) {
                console.log('Error Processing Media Genre Data');

                return res.status(500).json({
                    message: 'Failed to process Media Genre Mapping Data Insertion',
                    error: promiseError.message
                })
            }
        }
    }
    catch (error) {
        console.error('Error processing admin entry:', error);
        return res.status(500).json('Internal server error');
    }

})

module.exports = router;
