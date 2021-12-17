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

        const REFRESH_TOKEN = jwt.sign(user, process.env.SECRET_KEY, {
            expiresIn: "1 week"
        });

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



    static authToken = (req, res, next) => {

        const ACCESS_TOKEN = req.headers['authorization'].split(' ')[1];

        const { REFRESH_TOKEN } = req.cookies;

        jwt.verify(ACCESS_TOKEN, process.env.SECRET_KEY, async (err, decoded) => {
            if (decoded) {
                res.locals._id = decoded._id;
                next();
            } else {

                let registered = await db.query(
                `
                SELECT 1
                FROM SESSIONS S
                WHERE S.REFRESH_TOKEN = ?
                `, [REFRESH_TOKEN]);

                registered = registered[0];

                if (registered) {

                    jwt.verify(REFRESH_TOKEN, process.env.SECRET_KEY, async (err, decoded) => {
                        if (decoded) {
                            res.locals._id = decoded._id;
                            res.set(await this.generateToken({
                                _id: decoded._id,
                                email: decoded.email
                            }));
                            next();
                        } else res.status(401).send({ success: false, message: "Refresh token invalid!" });
                    });
                } else res.status(401).send({ success: false, message: "Token not registered!" });
            }
        });
    };
}

module.exports = Auth;