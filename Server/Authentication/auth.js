const jwt          = require('jsonwebtoken');
const db           = require('../Database/db');



class Auth {

    static generateToken = async (user, SESSION_ID, browser) => {

        user = {
            ...user,
            refresh: false
        };

        const ACCESS_TOKEN = jwt.sign(user, process.env.SECRET_KEY, {
            expiresIn: "15m"
        });

        user.refresh = true;

        const REFRESH_TOKEN = jwt.sign(user, process.env.SECRET_KEY, {
            expiresIn: "1 week"
        });

        try {

            let userExist = await db.query(
            `
            SELECT 1
            FROM SESSIONS
            WHERE ID_USER = ?
            AND SESSION_ID = ?
            `, [user._id, SESSION_ID]);

            userExist = userExist[0];

            if (userExist) {

                await db.query(
                `
                UPDATE SESSIONS
                SET
                ACCESS_TOKEN = ?,
                REFRESH_TOKEN = ?
                WHERE ID_USER = ?
                AND SESSION_ID = ?
                `, [ACCESS_TOKEN, REFRESH_TOKEN, user._id, SESSION_ID]);
            } else {
                await db.query(
                `
                INSERT INTO SESSIONS
                (ID_USER, ACCESS_TOKEN, REFRESH_TOKEN, BROWSER_NAME, BROWSER_VERSION, LATITUDE, LONGITUDE, DATE, SESSION_ID)
                VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    user._id,
                    ACCESS_TOKEN,
                    REFRESH_TOKEN,
                    browser.name,
                    browser.version,
                    browser.latitude,
                    browser.longitude,
                    new Date(),
                    SESSION_ID
                ]);
            }
        } catch (err) {
            console.log(err);
        }

        return {
            ACCESS_TOKEN: ACCESS_TOKEN,
            REFRESH_TOKEN: REFRESH_TOKEN
        };
    };



    static authToken = async (req, res, next) => {

        const ACCESS_TOKEN = req.headers['authorization'].split(' ')[1];

        const { REFRESH_TOKEN, SESSION_ID } = req.cookies;

        console.log("authToken");

        try {
            // JWT Cannot be unvalidated
            // With this check it'll be sure the token is stored
            // in the DB. By doing so tokens can now be deleted
            // in order to invalidate a session.

            // ANDs in this query are mandatory, they protect
            // from tokens injection, so it'll be sure
            // access_token, refresh_token and session_id
            // are all together preventing malicious user
            // from injecting their own session_id with a stolen
            // access_token/refresh_token
            let exists = await db.query(
            `
            SELECT
            S.ID_USER
            FROM SESSIONS S
            WHERE S.SESSION_ID  = ?
            AND S.ACCESS_TOKEN  = ?
            AND S.REFRESH_TOKEN = ?
            `, [SESSION_ID, ACCESS_TOKEN, REFRESH_TOKEN]);

            exists = exists[0];

            if (exists) {
                res.locals._id = exists.ID_USER;
                res.locals.SESSION_ID = SESSION_ID;

                jwt.verify(ACCESS_TOKEN, process.env.SECRET_KEY, async (err, decoded) => {
                    if (decoded) {
                        next();
                    } else {

                        jwt.verify(REFRESH_TOKEN, process.env.SECRET_KEY, async (err, decoded) => {
                            if (decoded) {
                                res.set(await this.generateToken({
                                    _id: decoded._id,
                                }, SESSION_ID));
                                next();
                            } else res.status(401).send({ success: false, message: "Invalid token!" });
                        });
                    }
                });
            } else res.status(401).send({ success: false, message: "Session expired or invalid token!" });
        } catch(err) {
            console.log(err);
            res.status(500).send({ success: false, message: "Internal server error!" });
        }
    };

}

module.exports = Auth;