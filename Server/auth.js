const jwt          = require('jsonwebtoken');
const db           = require('./db');
const fm           = require('date-fns');



class Auth {

    static generateToken = async (user) => {

        user = {
            ...user,
            refresh: false
        };
        
        const ACCESS_TOKEN = jwt.sign(user, process.env.ACCESS_TOKEN, {
            expiresIn: "15m"
        });

        user.refresh = true;

        const REFRESH_TOKEN = jwt.sign(user, process.env.ACCESS_TOKEN);

        try {

            await db.promise().query(`DELETE FROM SESSIONS WHERE ID_USER = ${user.id}`);
    
            await db.promise().query(
                `
                INSERT INTO SESSIONS
                (ID_USER, TOKEN, REFRESH_TOKEN)
                VALUES
                (${user.id}, '${ACCESS_TOKEN}', '${REFRESH_TOKEN}')
                `);

        } catch (err) {
            console.log(err);
        }

        return {
            ACCESS_TOKEN: ACCESS_TOKEN,
            REFRESH_TOKEN: REFRESH_TOKEN
        };
    };


    
    static authToken = async (req, res, next) => {
        
        const authHeader = req.headers['authorization'];
    
        const token = authHeader.split(' ')[1];
    
        if (token == null) return res.send({ 
            success: false, 
            message: "Authentication failed!"
        });

        let session = await db.promise().query(
            `
            SELECT 
            ID_USER
            FROM SESSIONS
            WHERE TOKEN = '${token}'
            `);

        session = session[0][0];

        session = undefined;
        
        if (session)
            next();
        else {
            const { REFRESH_TOKEN } = req.cookies;

            let dbRefreshToken = await db.promise().query(
                `
                SELECT
                S.REFRESH_TOKEN,
                U.NICKNAME,
                U.ID_USER
                FROM SESSIONS S
                LEFT JOIN USERS U ON U.ID_USER = S.ID_USER
                WHERE S.REFRESH_TOKEN = '${REFRESH_TOKEN}'
                `);

            dbRefreshToken = dbRefreshToken[0][0];

            if (dbRefreshToken) {
                const { access_token, refresh_token } = await this.generateToken({
                    id: dbRefreshToken.ID_USER,
                    userName: dbRefreshToken.NICKNAME
                });

                next();
            } else {
                return res.send({ success: false, message: "There has been an error with the token authentication" });
            }

        }
    }
}

module.exports = Auth;