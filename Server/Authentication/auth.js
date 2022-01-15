const jwt          = require('jsonwebtoken');
const db           = require('../Database/db');
const fm           = require('date-fns');
const NodeGeocoder = require('node-geocoder');



const options = {
    provider: 'google',
    apiKey: '',
    formatter: null 
};
const geocoder = NodeGeocoder(options);



  
class Auth {

    static generateToken = async (user) => {

        user = {
            ...user,
            refresh: false
        };

        const browser = user.browser;

        delete user.browser;

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
            `, [user._id, user.SESSION_ID]);

            userExist = userExist[0];

            if (userExist) {

                await db.query(
                `
                UPDATE SESSIONS
                SET
                REFRESH_TOKEN = ?
                WHERE ID_USER = ?
                AND SESSION_ID = ?
                `, [REFRESH_TOKEN, user._id, user.SESSION_ID]);
            } else {
                const res = await geocoder.geocode('29 champs elysée paris');
                console.log(res);
                await db.query(
                `
                INSERT INTO SESSIONS
                (ID_USER, REFRESH_TOKEN, BROWSER_NAME, BROWSER_VERSION, SESSION_ID)
                VALUES
                (?, ?, ?, ?, ?)
                `, [user._id, REFRESH_TOKEN, browser.name, browser.version, user.SESSION_ID]);
            }
        } catch (err) {
            console.log(err);
        }

        return {
            ACCESS_TOKEN: ACCESS_TOKEN,
            REFRESH_TOKEN: REFRESH_TOKEN,
            SESSION_ID: user.SESSION_ID
        };
    };



    static authToken = (req, res, next) => {

        const ACCESS_TOKEN = req.headers['authorization'].split(' ')[1];

        const { REFRESH_TOKEN, SESSION_ID } = req.cookies;

        jwt.verify(ACCESS_TOKEN, process.env.SECRET_KEY, async (err, decoded) => {
            if (decoded) {
                res.locals._id = decoded._id;
                res.locals.SESSION_ID = decoded.SESSION_ID;
                next();
            } else {
                let registered = await db.query(
                `
                SELECT 1
                FROM SESSIONS S
                WHERE S.REFRESH_TOKEN = ?
                AND S.SESSION_ID = ?
                `, [REFRESH_TOKEN, SESSION_ID]);

                registered = registered[0];

                if (registered) {

                    jwt.verify(REFRESH_TOKEN, process.env.SECRET_KEY, async (err, decoded) => {
                        if (decoded) {
                            res.locals._id = decoded._id;
                            res.locals.SESSION_ID = decoded.SESSION_ID;
                            res.set(await this.generateToken({
                                _id: decoded._id,
                                email: decoded.email,
                                SESSION_ID: decoded.SESSION_ID
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