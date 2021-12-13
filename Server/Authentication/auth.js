const jwt          = require('jsonwebtoken');
const db           = require('../Database/db');
const fm           = require('date-fns');


class Auth {

    static generateToken = async (user) => {

        user = {
            ...user,
            refresh: false
        };

        const ACCESS_TOKEN = jwt.sign(user, process.env.SECRET_KEY, {
            expiresIn: "15m"
        });

        user.refresh = true;

        const REFRESH_TOKEN = jwt.sign(user, process.env.SECRET_KEY);

        try {

            let userExist = await db.query(
            `
            SELECT 1 
            FROM SESSIONS
            WHERE ID_USER = ?
            `, [user._id]);

            userExist = userExist[0];

            if (userExist) {

                await db.query(
                `
                UPDATE SESSIONS
                SET
                TOKEN = ?,
                REFRESH_TOKEN = ?
                WHERE ID_USER = ?
                `, [ACCESS_TOKEN, REFRESH_TOKEN, user._id]);
            } else {

                await db.query(
                `
                INSERT INTO SESSIONS
                (ID_USER, TOKEN, REFRESH_TOKEN)
                VALUES
                (?, ?, ?)
                `, [user._id, ACCESS_TOKEN, REFRESH_TOKEN]);
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

        if (ACCESS_TOKEN == null) return res.status(401).send({ 
            success: false, 
            message: "Authentication failed!"
        });

        let session = await db.query(
        `
        SELECT
        ID_USER
        FROM SESSIONS
        WHERE TOKEN = ?
        `, [ACCESS_TOKEN]);

        session = session[0];

        if (session) {

            res.locals._id = session.ID_USER;

            jwt.verify(ACCESS_TOKEN, process.env.SECRET_KEY, (err, decoded) => {
                if (decoded) {
                    next();
                } else {

                    const { REFRESH_TOKEN } = req.cookies;

                    jwt.verify(REFRESH_TOKEN, process.env.SECRET_KEY, async (err, decoded) => {
                        if (decoded) {

                            let dbRefreshToken = await db.query(
                            `
                            SELECT
                            U.EMAIL,
                            U.ID_USER
                            FROM USERS U
                            LEFT JOIN SESSIONS S ON S.ID_USER = U.ID_USER
                            WHERE S.REFRESH_TOKEN = ?
                            `, [REFRESH_TOKEN]);

                            dbRefreshToken = dbRefreshToken[0];

                            if (dbRefreshToken) {
                                res.set(await this.generateToken({
                                    _id: dbRefreshToken.ID_USER,
                                    email: dbRefreshToken.EMAIL
                                }));
                                next();
                            } else {
                                return res.status(401).send({ success: false, message: "There has been an error with the token authentication" });
                            }
                        } else res.status(401).send({ success: false, message: "Refresh token invalid!" });
                    });
                }
            });
        } else {
            res.status(401).send({ success: false, message: "Token not found!" });
        }
    }



    // This middleware needs to be called ALWAYS after the authToken or it won't work
    static isInChannel = (METHOD) => {

        return async (req, res, next) => {

            const ID_USER = res.locals._id;

            const ID_CHANNEL = req.body.channelID;

            try {

                let exist = await db.query(
                `
                SELECT 1
                FROM CHANNELS_MEMBERS
                WHERE ID_USER = ?
                AND ID_CHANNEL = ?
                `, [ID_USER, ID_CHANNEL]);

                exist = exist[0];

                if (exist) {
                    next();
                } else {
                    res.status(401).send({ success: false, message: "User is not authorized to perform this operation!" });
                }
            } catch (err) {
                console.log(err);

                res.status(500).send({ success: false, message: "Database error!" });
            }
        }
    }
}

module.exports = Auth;