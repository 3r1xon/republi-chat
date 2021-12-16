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
                REFRESH_TOKEN = ?
                WHERE ID_USER = ?
                `, [REFRESH_TOKEN, user._id]);
            } else {

                await db.query(
                `
                INSERT INTO SESSIONS
                (ID_USER, REFRESH_TOKEN)
                VALUES
                (?, ?)
                `, [user._id, REFRESH_TOKEN]);
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

        const { REFRESH_TOKEN } = req.cookies;

        if (ACCESS_TOKEN == null) return res.status(401).send({ 
            success: false, 
            message: "Authentication failed!"
        });

        console.log(REFRESH_TOKEN);

        let session = await db.query(
        `
        SELECT
        U.ID_USER,
        U.EMAIL
        FROM USERS U
        LEFT JOIN SESSIONS S ON S.ID_USER = U.ID_USER
        WHERE REFRESH_TOKEN = ?
        `, [REFRESH_TOKEN]);

        session = session[0];

        console.log(session);

        if (session) {

            res.locals._id = session.ID_USER;

            jwt.verify(ACCESS_TOKEN, process.env.SECRET_KEY, (err, decoded) => {
                if (decoded) {
                    next();
                } else {

                    jwt.verify(REFRESH_TOKEN, process.env.SECRET_KEY, async (err, decoded) => {
                        if (decoded) {

                            res.set(await this.generateToken({
                                _id: session.ID_USER,
                                email: session.EMAIL
                            }));
                            next();
                        } else res.status(401).send({ success: false, message: "Refresh token invalid!" });
                    });
                }
            });
        } else {
            res.status(401).send({ success: false, message: "Token not found!" });
        }
    };
}

module.exports = Auth;