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
    }
    catch (error) {
        console.error('Error processing admin entry:', error);
        return res.status(500).json('Internal server error');
    }

})

module.exports = router;
