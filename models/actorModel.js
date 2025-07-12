const db = require('../config/database');

class ActorModel {

    static async getActorByID(actorid) {
        const actorQuery = `SELECT * FROM ACTOR WHERE actorid = $1`;

        // Use of Advance SQL [JOIN Statements]
        const actorMediasQuery = `Select ME.mediaid, title, releaseyear, mediatype, poster FROM MEDIA ME JOIN MEDIAACTOR MA ON (ME.mediaid = MA.mediaid) WHERE actorid = $1`
        const actorawardQuery = `SELECT aa.actorid, a.awardname, a.awardcategory, aa.year FROM actoraward aa JOIN award a ON aa.awardid = a.awardid WHERE aa.actorid = $1 ORDER BY aa.year DESC;
`;

        const actorResult = await db.query(actorQuery, [actorid]);
        console.log(`ActorData Query Successful for ${actorResult.actorname}`);

        const actorMediaResult = await db.query(actorMediasQuery, [actorid]);
        console.log(`ActorMedia Query Successful for ${actorResult.actorname}`);

        const actorAwardResult = await db.query(actorawardQuery, [actorid]);
        console.log(`ActorAward Query Successful for ${actorResult.actorname}`);

        const actorData = actorResult.rows[0];
        actorData.medias = actorMediaResult.rows;
        actorData.awards = actorAwardResult.rows;


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