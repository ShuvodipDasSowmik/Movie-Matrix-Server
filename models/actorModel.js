const db = require('../config/database');

class ActorModel {

    static async getActorByID(actorid) {
        const actorQuery = `SELECT * FROM ACTOR WHERE actorid = $1`;

        // Use of Advance SQL [JOIN Statements]
        const actorMediasQuery = `Select ME.mediaid, title, releaseyear, poster FROM MEDIA ME JOIN MEDIAACTOR MA ON (ME.mediaid = MA.mediaid) WHERE actorid = $1`


        const actorResult = await db.query(actorQuery, [actorid]);
        console.log(`ActorData Query Successful for ${actorResult.actorname}`);

        const actorMediaResult = await db.query(actorMediasQuery, [actorid]);
        console.log(`ActorMedia Query Successful for ${actorResult.actorname}`);

        const actorData = actorResult.rows[0];
        actorData.medias = actorMediaResult.rows;


        return actorData;
    }

    static async getAllActors() {
        const actorQuery = `SELECT actorid, actorname, picture, nationality FROM ACTOR`;


        const actorResult = await db.query(actorQuery);
        console.log(`Actor Query Successful`);

        return actorResult.rows;
    }
}

module.exports = ActorModel;