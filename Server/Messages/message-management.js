const express  = require('express');
const Auth     = require('../Authentication/auth');
const router   = express.Router();
const REPQuery = require('../Database/rep-query');
const fm       = require('date-fns');
const DBUser   = require('../Authentication/db-user');
const clc      = require('cli-color');
const { io }   = require('../start');
const REPTools = require('../Tools/rep-tools');


router.use(Auth.HTTPAuthToken);


router.get('/getRoomMessages/:id/:limit', async (req, res) => {

  const _id        = res.locals._id;
  const _channelID = req.params.id;
  const user       = new DBUser(_id);

  user.setChannel(_channelID, async (err, chUser) => {
    if (err) {
      res.status(401).send({ success: false, message: "User not in channel!" });
    } else {

      try {
        // Ensures limit is a number
        const limit = parseInt(req.params.limit);

        const messages = await REPQuery.load(
        `
        SELECT M.ID_CHANNEL_MESSAGE         as id,
               U.COLOR                      as color,
               U.BACKGROUND_COLOR           as backgroundColor,
               U.NAME                       as name,
               CM.ID_CHANNEL_MEMBER         as author,
               TO_BASE64(U.PROFILE_PICTURE) as picture,
               M.MESSAGE                    as message,
               M.DATE                       as date
        FROM CHANNELS_MESSAGES M
                 LEFT JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL_MEMBER = M.ID_CHANNEL_MEMBER
                 LEFT JOIN CHANNELS C ON C.ID_CHANNEL = M.ID_CHANNEL
                 LEFT JOIN USERS U ON U.ID_USER = CM.ID_USER
        WHERE C.ID_CHANNEL = ?
          AND M.DATE >= ?
        LIMIT ${limit}
        `, [_channelID, chUser.joinDate]);

        res.status(200).send({ success: true, data: messages });
      }
      catch (error) {
        console.log(clc.red(error));

        res.status(500).send({ success: false, message: "Internal server error!" });
      }
    }
  });
});



router.get("/getChannelPermissions/:id", async (req, res) => {

  const _id        = res.locals._id;
  const _channelID = req.params.id;
  const user       = new DBUser(_id);

  user.setChannel(_channelID, async (err, user) => {
    if (err) {
      res.status(401).send({ success: false, message: "User not in channel!" });
    } else {

      try {

        const permissions = await REPQuery.one(
        `
        SELECT ID_CHANNEL_MEMBER as id,
               DELETE_MESSAGE    as deleteMessage,
               KICK_MEMBERS      as kickMembers,
               BAN_MEMBERS       as banMembers,
               SEND_MESSAGES     as sendMessages
        FROM CHANNELS_PERMISSIONS
        WHERE ID_CHANNEL_MEMBER = ?
        `, [user.channelMemberID]);

        const _id = permissions.id;

        REPTools.keysToBool(permissions);

        permissions.id = _id;

        res.status(200).send({ success: true, data: permissions });
      }
      catch (error) {
        console.log(clc.red(error));

        res.status(500).send({ success: false, message: "Internal server error!" });
      }
    }
  });
});



io.on("connection", (socket) => {

  const userID = socket.auth._id;

  const user = new DBUser(userID);

  let room;

  socket.on("joinChannel", (obj) => {

    const rqRoom = obj.room;

    socket.leave(room);

    user.setChannel(rqRoom, async (err) => {
      if (err) {
        console.log(clc.yellow(err));
      } else {
        socket.join(rqRoom);
        room = rqRoom;
      }
    });
  });

  socket.on("message", (msg) => {

    user.sendMessage(msg);

  });

  socket.on("deleteMessage", (msgID) => {

    user.deleteMessage(msgID);

  });

});



module.exports = router;