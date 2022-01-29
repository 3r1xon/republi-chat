const REPQuery = require('../Database/rep-query');
const clc      = require('cli-color');


class Auth {
  /**
   * Middlware that authenticate the user in the HTTP Request.
   *
   */
    static HTTPAuthToken = async (req, res, next) => {

        const sid = req.cookies["sid"];

        if (sid) {

            try {

                const dbUser = await REPQuery.one(
                `
                SELECT S.ID_USER,
                       S.SOCKET_ID
                FROM SESSIONS S
                WHERE S.SID = ?
                `, [sid]);

                if (dbUser) {
                    res.locals._id = dbUser.ID_USER;
                    res.locals.sid = sid;
                    res.locals.socket_id = dbUser.SOCKET_ID;
                    next();
                } else {
                    res.clearCookie("sid");
                    res.status(401).send({ success: false, message: "Session expired or invalid token!" })
                };
            } catch(err) {
                console.log(clc.red(err));

                res.status(500).send({ success: false, message: "Internal server error!" });
            }
        } else {
            res.clearCookie("sid");
            res.status(401).send({ success: false, message: "No token provided!" })
        };
    };



    static WSAuthToken = async (socket, next) => {

        try {

            const sid = socket.request.headers.cookie.split("sid=")[1];

            const dbUser = await REPQuery.one(
            `
            SELECT S.ID_USER,
                   S.ID_SESSION
            FROM SESSIONS S
            WHERE S.SID = ?
            `, [sid]);

            if (dbUser) {
                await REPQuery.exec(
                `
                UPDATE
                    SESSIONS
                SET SOCKET_ID = ?
                WHERE ID_SESSION = ?
                `, [socket.id, dbUser.ID_SESSION]);

                socket.auth = {
                    _id: dbUser.ID_USER,
                    sid: sid
                };
                next();
            } else {
                socket.disconnect();
            };
        } catch(err) {
            console.log(clc.red(err));
        }
    }

}

module.exports = Auth;