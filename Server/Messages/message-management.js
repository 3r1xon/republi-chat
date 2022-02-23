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

  const userID = res.locals._id;
  const roomID = req.params.id;
  const user   = new DBUser(userID);

  user.setRoom(roomID, async (err, chUser) => {
    if (err) {
      res.status(401).send({ success: false, message: "User not in channel!" });
    } else {

      try {
        // Ensures limit is a number
        const limit = parseInt(req.params.limit);

        const messages = await REPQuery.load(
        `
        SELECT CRM.ID_CHANNEL_ROOM_MESSAGE  as id,
               U.COLOR                      as color,
               U.BACKGROUND_COLOR           as backgroundColor,
               U.NAME                       as name,
               CM.ID_CHANNEL_MEMBER         as author,
               TO_BASE64(U.PROFILE_PICTURE) as picture,
               CRM.MESSAGE                  as message,
               CRM.DATE                     as date
        FROM CHANNELS_ROOMS_MESSAGES CRM
                 LEFT JOIN channels_rooms_members CRMB ON CRMB.ID_CHANNEL_ROOM_MEMBER = CRM.ID_CHANNEL_ROOM_MEMBER
                 LEFT JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL_MEMBER = CRMB.ID_CHANNEL_MEMBER
                 LEFT JOIN CHANNELS C ON C.ID_CHANNEL = CM.ID_CHANNEL
                 LEFT JOIN USERS U ON U.ID_USER = CM.ID_USER
        WHERE CRM.ID_CHANNEL_ROOM = ?
          AND CRM.DATE >= ?
        LIMIT ${limit}
        `, [roomID, chUser.roomJoinDate]);

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
               DELETE_MESSAGES   as deleteMessage,
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

  socket.on("joinRoom", (obj) => {

    const rqRoom = obj.room;

    socket.leave(room);

    user.setRoom(rqRoom, async (err) => {
      if (err) {
        console.log(clc.yellow(err));
      } else {
        console.log("joining")
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