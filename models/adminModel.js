const db = require('../config/database');
require('dotenv').config();

class AdminModel {
    static async insertGenres(genreValues, res) {
        const genreQuery = `INSERT INTO GENRE (genrename) VALUES ($1)`;
        try {
            const results = await Promise.all(
                genreValues.map(async (value) => {
                    try {
                        const result = await db.query(genreQuery, [value.GenreName]);
                        return { success: true, result };
                    } catch (queryError) {
                        return { success: false, result: queryError.message };
                    }
                })
            );
            const failures = results.filter(result => !result.success);
            if (failures.length > 0) {
                return res.status(207).json({
                    message: 'Some genres could not be inserted',
                    success: results.filter(result => result.success),
                    failures
                });
            }
            return res.status(200).json({ message: 'Success', results });
        } catch (promiseError) {
            return res.status(500).json({
                message: 'Failed to process Genre Insertions',
                error: promiseError.message
            });
        }
    }

    static async insertStudios(studioData, res) {
        const studioQuery = `INSERT INTO STUDIO (studioname, foundingyear, location) VALUES ($1, $2, $3)`;
        try {
            const results = await Promise.all(
                studioData.map(async (value) => {
                    try {
                        const result = await db.query(studioQuery, [value.StudioName, value.FoundingYear, value.Location]);
                        return { success: true, result };
                    } catch (queryError) {
                        return { success: false, result: queryError.message };
                    }
                })
            );
            const failures = results.filter(result => !result.success);
            if (failures.length > 0) {
                return res.status(207).json({
                    message: 'Some studios could not be inserted',
                    success: results.filter(result => result.success),
                    failures
                });
            }
            return res.status(200).json({ message: 'Success', results });
        } catch (promiseError) {
            return res.status(500).json({
                message: 'Failed to process Studio insertions',
                error: promiseError.message
            });
        }
    }

    static async insertActors(actorData, res) {
        const actorQuery = `INSERT INTO ACTOR (actorname, biography, nationality, dob) VALUES ($1, $2, $3, $4)`;
        try {
            const results = await Promise.all(
                actorData.map(async (value) => {
                    try {
                        const result = await db.query(actorQuery, [value.ActorName, value.Biography, value.Nationality, value.DOB]);
                        return { success: true, result };
                    } catch (queryError) {
                        return { success: false, result: queryError.message };
                    }
                })
            );
            const failures = results.filter(result => !result.success);
            if (failures.length > 0) {
                return res.status(207).json({
                    message: 'Some Actor Data could not be inserted',
                    success: results.filter(result => result.success),
                    failures
                });
            }
            return res.status(200).json({ message: 'Success', results });
        } catch (promiseError) {
            return res.status(500).json({
                message: 'Failed to process Actor insertions',
                error: promiseError.message
            });
        }
    }

    static async insertDirectors(directorData, res) {
        const directorQuery = `INSERT INTO DIRECTOR (directorname, biography, nationality, dob) VALUES ($1, $2, $3, $4)`;
        try {
            const results = await Promise.all(
                directorData.map(async (value) => {
                    try {
                        const result = await db.query(directorQuery, [value.DirectorName, value.Biography, value.Nationality, value.DOB]);
                        return { success: true, result };
                    } catch (queryError) {
                        return { success: false, result: queryError.message };
                    }
                })
            );
            const failures = results.filter(result => !result.success);
            if (failures.length > 0) {
                return res.status(207).json({
                    message: 'Some Director Data could not be inserted',
                    success: results.filter(result => result.success),
                    failures
                });
            }
            return res.status(200).json({ message: 'Success', results });
        } catch (promiseError) {
            return res.status(500).json({
                message: 'Failed to process Director insertions',
                error: promiseError.message
            });
        }
    }

    static async insertMedia(mediaData, res) {
        const mediaQuery = `INSERT INTO MEDIA (title, releaseyear, description, language, pgrating, trailerlink, mediatype)
                        VALUES ($1, $2, $3, $4, $5, $6, $7)
                        RETURNING mediaid`;
        try {
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
                        } else if (value.mediatype.toLowerCase() === 'series') {
                            const mediaTypeQuery = `INSERT INTO TVSERIES (mediaid, isongoing) VALUES ($1, $2)`;
                            await db.query(mediaTypeQuery, [mediaid, value.isongoing]);
                        }
                        return { success: true, result: value.title };
                    } catch (err) {
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
            return res.status(500).json({
                message: 'Failed to process Media Data Insertion',
                error: promiseError.message
            });
        }
    }

    static async insertMediaActors(mediaActorData, res) {
        const mediaActorQuery = `INSERT INTO MEDIAACTOR (mediaid, actorid) VALUES ((SELECT mediaid FROM MEDIA WHERE title = $1), (SELECT actorid FROM ACTOR WHERE actorname = $2))`;
        try {
            const results = await Promise.all(
                mediaActorData.map(async (value) => {
                    try {
                        const result = await db.query(mediaActorQuery, [value.Media, value.Actor]);
                        return { success: true, result };
                    } catch (queryError) {
                        return { success: false, result: queryError.message };
                    }
                })
            );
            const failures = results.filter(result => !result.success);
            if (failures.length > 0) {
                return res.status(207).json({
                    message: 'Some Movie Actor Mapping Data could not be inserted',
                    success: results.filter(result => result.success),
                    failures
                });
            }
            return res.status(200).json({ message: 'Success', results });
        } catch (promiseError) {
            return res.status(500).json({
                message: 'Failed to process Media Actor Data Insertions',
                error: promiseError.message
            });
        }
    }

    static async insertMediaDirectors(mediaDirectorData, res) {
        const mediaDirectorQuery = `INSERT INTO MEDIADIRECTOR (mediaid, directorid) VALUES ((SELECT mediaid FROM MEDIA WHERE title = $1), (SELECT directorid FROM DIRECTOR WHERE directorname = $2))`;
        try {
            const results = await Promise.all(
                mediaDirectorData.map(async (value) => {
                    try {
                        const result = await db.query(mediaDirectorQuery, [value.media, value.director]);
                        return { success: true, result };
                    } catch (queryError) {
                        return { success: false, result: queryError.message };
                    }
                })
            );
            const failures = results.filter(result => !result.success);
            if (failures.length > 0) {
                return res.status(207).json({
                    message: 'Some Media Director Mapping Data Insertion Not Successful',
                    success: results.filter(result => result.success),
                    failures
                });
            }
            return res.status(200).json({ message: 'Success', results });
        } catch (promiseError) {
            return res.status(500).json({
                message: 'Failed to process Media Director Data Insertion',
                error: promiseError.message
            });
        }
    }

    static async insertMediaStudios(mediaStudioData, res) {
        const mediaStudioQuery = `INSERT INTO MEDIASTUDIO (mediaid, studioid) VALUES ((SELECT mediaid FROM MEDIA WHERE title = $1), (SELECT studioid FROM STUDIO WHERE studioname = $2))`;
        try {
            const results = await Promise.all(
                mediaStudioData.map(async (value) => {
                    try {
                        const result = await db.query(mediaStudioQuery, [value.Media, value.Studio]);
                        return { success: true, result };
                    } catch (queryError) {
                        return { success: false, result: queryError.message };
                    }
                })
            );
            const failures = results.filter(result => !result.success);
            if (failures.length > 0) {
                return res.status(207).json({
                    message: 'Some Media Studio Mapping Data Insertion Not Successful',
                    success: results.filter(result => result.success),
                    failures
                });
            }
            return res.status(200).json({ message: 'Success', results });
        } catch (promiseError) {
            return res.status(500).json({
                message: 'Failed to process Media Studio Mapping Data Insertion',
                error: promiseError.message
            });
        }
    }

    static async insertMediaGenres(mediaGenreData, res) {
        const mediaGenreQuery = `INSERT INTO MEDIAGENRE (mediaid, genreid) VALUES ((SELECT mediaid FROM MEDIA WHERE title = $1),(SELECT genreid FROM GENRE WHERE genrename = $2))`;
        try {
            const results = await Promise.all(
                mediaGenreData.map(async (value) => {
                    try {
                        const result = await db.query(mediaGenreQuery, [value.media, value.genre]);
                        return { success: true, result };
                    } catch (queryError) {
                        return { success: false, result: queryError.message };
                    }
                })
            );
            const failures = results.filter(result => !result.success);
            if (failures.length > 0) {
                return res.status(207).json({
                    message: 'Some Media Genre Mapping Data Insertion Not Successful',
                    success: results.filter(result => result.success),
                    failures
                });
            }
            return res.status(200).json({ message: 'Success', results });
        } catch (promiseError) {
            return res.status(500).json({
                message: 'Failed to process Media Genre Mapping Data Insertion',
                error: promiseError.message
            });
        }
    }

    static async getAdminStats() {
        try {
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
            
            return result.rows[0];
        }
        
        catch (error) {
            throw error;
        }
    }

    static async sendEmail(users, subject, body) {
        const nodemailer = require('nodemailer');

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS 
            }
        });

        try {
            const results = await Promise.all(users.map(async (user) => {
                const personalizedBody = `Dear ${user.username},\n\n${body}\n\nRegards,\nMovie Matrix Admin`;
                
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: subject,
                    text: personalizedBody
                };

                return transporter.sendMail(mailOptions);
            }));

            
            return {
                success: true,
                message: `${users.length} emails sent successfully`,
                details: {
                    sent: results.length
                }
            };
        }
        catch (err) {
            console.log("Error: ", err.message);
            
            return {
                success: false,
                message: 'Failed to send emails',
                error: err.message
            };
        }
    }


    static async getUserLocationInfo(){
        // Replace 'user_activity' with your actual table name if different
        const uniqueVisitorsQuery = `
            SELECT COUNT(DISTINCT ip_address) AS uniqueVisitors
            FROM user_activity
        `;
        const countryQuery = `
            SELECT
                country,
                COUNT(DISTINCT ip_address) AS userCount
            FROM
                user_activity
            GROUP BY
                country
        `;
        const cityQuery = `
            SELECT
                city,
                COUNT(DISTINCT ip_address) AS userCount
            FROM
                user_activity
            GROUP BY
                city
        `;
        const regionQuery = `
            SELECT
                regionname,
                COUNT(DISTINCT ip_address) AS userCount
            FROM
                user_activity
            GROUP BY
                regionname
        `;
        const osQuery = `
            SELECT
                os,
                COUNT(DISTINCT ip_address) AS userCount
            FROM
                user_activity
            GROUP BY
                os
        `;

        try {
            const uniqueVisitorsResult = await db.query(uniqueVisitorsQuery);
            const countryResult = await db.query(countryQuery);
            const cityResult = await db.query(cityQuery);
            const regionResult = await db.query(regionQuery);
            const osResult = await db.query(osQuery);

            return {
                uniqueVisitors: uniqueVisitorsResult.rows[0]?.uniquevisitors || 0,
                countries: countryResult.rows,
                cities: cityResult.rows,
                regions: regionResult.rows,
                os: osResult.rows
            };
        }
        catch (error) {
            console.error("Error fetching user location info:", error);
            throw error;
        }
    }

}

module.exports = AdminModel;