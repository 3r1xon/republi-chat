const db           = require('../Database/db');
const clc          = require('cli-color');



class Auth {
  /**
   * Middlware that authenticate the user in the HTTP Request.
   * 
   */
    static authToken = async (req, res, next) => {

        const SESSION_ID = req.cookies["SESSION_ID"];

        if (SESSION_ID) {

            try {

                let dbUser = await db.query(
                `
                SELECT
                S.ID_USER
                FROM SESSIONS S
                WHERE S.SESSION_ID  = ?
                `, [SESSION_ID]);

                dbUser = dbUser[0];

                if (dbUser) {
                    res.locals._id = dbUser.ID_USER;
                    res.locals.SESSION_ID = SESSION_ID;
                    next();
                } else res.status(401).send({ success: false, message: "Session expired or invalid token!" });
            } catch(err) {
                console.log(clc.red(error));
                res.status(500).send({ success: false, message: "Internal server error!" });
            }
        } else res.status(401).send({ success: false, message: "No token provided!" });
    };

}

module.exports = Auth;