const nanoid       = require('nanoid');
const db           = require('../Database/db');



class Auth {
  /**
   * Generates a SESSION ID inserting it in the database.
   *
   * @param userID The ID of the user that needs a SESSION ID.
   *
   * @param browser Browser informations
   * 
   * @returns A SESSION ID
   * 
   */
    static generateToken = async (userID, browser) => {

        const SESSION_ID = nanoid.nanoid();

        try {

            await db.query(
            `
            INSERT INTO SESSIONS
            (ID_USER, BROWSER_NAME, BROWSER_VERSION, LATITUDE, LONGITUDE, DATE, SESSION_ID)
            VALUES
            (?, ?, ?, ?, ?, ?, ?)
            `, [
                userID,
                browser.name,
                browser.version,
                browser.latitude,
                browser.longitude,
                new Date(),
                SESSION_ID
            ]);
        } catch (err) {
            console.log(err);
        }

        return SESSION_ID;
    };


  /**
   * Middlware that authenticate the user in the HTTP Request.
   * 
   */
    static authToken = async (req, res, next) => {

        const { SESSION_ID } = req.cookies;

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
            console.log(err);
            res.status(500).send({ success: false, message: "Internal server error!" });
        }
    };

}

module.exports = Auth;