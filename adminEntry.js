const express = require('express');
const db = require('./database');
const router = express.Router();

router.post('/admin', async (req, res) => {

    try {
        const reqData = req.body;
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
                        success: results.filter(result => result.succes),
                        failures: failures
                    });
                }

                console.log(`Genre Data Insertion Successful`)

                return res.status(200).json({ message: 'Success', results });

            }catch(promiseError){
                console.error('Error Processing Genre Queries: ', promiseError);

                // res.status(500) -- Internal Server Error that aren't related to user input
                return res.status(500).json({
                    message: 'Failed to process Genre Insertions',
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
