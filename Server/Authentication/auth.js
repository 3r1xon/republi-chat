const db           = require('../Database/db');



class Auth {
  /**
   * Middlware that authenticate the user in the HTTP Request.
   * 
   */
    static authToken = async (req, res, next) => {

        const SESSION_ID = req.cookies["SESSION_ID"];

        try {

            let dbUser = await db.query(
            `
            SELECT
            S.ID_USER
            FROM SESSIONS S
            WHERE S.SESSION_ID  = ?
            `, [SESSION_ID]);

            console.log (req.session)

            dbUser = dbUser[0];

            if (dbUser) {
                res.locals._id = dbUser.ID_USER;
                res.locals.SESSION_ID = SESSION_ID;
                next();
            } else res.status(401).send({ success: false, message: "Session expired or invalid token!" });
        } catch(err) {
            console.log(err);
            res.status(500).send({ success: false, message: "Internal server error!" });
        }
    };

}

module.exports = Auth;