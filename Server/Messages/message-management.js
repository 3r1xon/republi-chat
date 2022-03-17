const express  = require('express');
const Auth     = require('../Authentication/auth');
const router   = express.Router();
const REPQuery = require('../Database/rep-query');
const fm       = require('date-fns');
const DBUser   = require('../Authentication/db-user');
const clc      = require('cli-color');


router.use(Auth.HTTPAuthToken);


router.get('/getRoomMessages/:chID/:roomID/:limit', async (req, res) => {

  const userID    = res.locals._id;
  const roomID    = req.params.roomID;
  const channelID = req.params.chID;
  const user      = new DBUser(userID);

  user.setChannel(channelID, (chErr) => {
    if (chErr) {
      res.status(401).send({ success: false, message: "User not in channel!" });
    } else {
      user.setRoom(roomID, async (err, chUser) => {
        if (err) {
          res.status(401).send({ success: false, message: "User not in room!" });
        } else {

          try {
            // Ensures limit is a number
            //const limit = parseInt(req.params.limit);
            const limit = 9999;

            const messages = await REPQuery.load(
            `
            SELECT CRM.ID_CHANNEL_ROOM_MESSAGE  as id,
                   U.COLOR                      as color,
                   U.BACKGROUND_COLOR           as backgroundColor,
                   U.NAME                       as name,
                   CM.ID_CHANNEL_MEMBER         as author,
                   TO_BASE64(U.PROFILE_PICTURE) as picture,
                   CRM.MESSAGE                  as message,
                   CRM.DATE                     as date,
                   CRM.HIGHLIGHTED              as highlighted
            FROM CHANNELS_ROOMS_MESSAGES CRM
                     LEFT JOIN channels_rooms_members CRMB ON CRMB.ID_CHANNEL_ROOM_MEMBER = CRM.ID_CHANNEL_ROOM_MEMBER
                     LEFT JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL_MEMBER = CRMB.ID_CHANNEL_MEMBER
                     LEFT JOIN CHANNELS C ON C.ID_CHANNEL = CM.ID_CHANNEL
                     LEFT JOIN USERS U ON U.ID_USER = CM.ID_USER
            WHERE CRM.ID_CHANNEL_ROOM = ?
              AND CRM.DATE >= ?
            LIMIT ${limit}
            `, [roomID, chUser.roomJoinDate]);

            console.log(messages);

            res.status(200).send({ success: true, data: messages });
          }
          catch (error) {
            console.log(clc.red(error));

            res.status(500).send({ success: false, message: "Internal server error!" });
          }
        }
      });
    }
  });
});



module.exports = router;