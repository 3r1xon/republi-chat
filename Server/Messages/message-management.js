const express        = require('express');
const Auth           = require('../Authentication/auth');
const router         = express.Router();
const REPQuery       = require('../Database/rep-query');
const fm             = require('date-fns');
const io             = require('../start');
const DBUser         = require('../Authentication/db-user');
const permissions    = require('../Authentication/permissions');
const clc            = require('cli-color');


router.use(Auth.HTTPAuthToken);



router.get('/getChannelMessages/:id/:limit', async (req, res) => {

  const _id        = res.locals._id;
  const _channelID = req.params.id;
  const user       = new DBUser(_id);

  user.setChannel(_channelID, async (err, user) => {
    if (err) {
      res.status(401).send({ success: false, message: "User not in channel!" });
    } else {

      try {

        const limit = req.params.limit;

        const messages = await REPQuery.load(
        `
        SELECT
        M.ID_CHANNEL_MESSAGE as id,
        U.COLOR as color,
        U.NAME as name,
        CM.ID_CHANNEL_MEMBER as author,
        TO_BASE64(U.PROFILE_PICTURE) as picture,
        M.MESSAGE as message,
        M.DATE as date,
        IF(U.ID_USER = ?, TRUE, FALSE) as auth
        FROM CHANNELS_MESSAGES M
        LEFT JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL_MEMBER = M.ID_CHANNEL_MEMBER
        LEFT JOIN CHANNELS C ON C.ID_CHANNEL = M.ID_CHANNEL
        LEFT JOIN USERS U ON U.ID_USER = CM.ID_USER
        WHERE C.ID_CHANNEL = ?
        LIMIT ${limit}
        `, [_id, _channelID, limit]);

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
        SELECT
        ID_CHANNEL_MEMBER as id,
        DELETE_MESSAGE as deleteMessage,
        KICK_MEMBERS as kickMembers,
        BAN_MEMBERS as banMembers,
        SEND_MESSAGES as sendMessages
        FROM CHANNELS_PERMISSIONS
        WHERE ID_CHANNEL_MEMBER = ?
        `, [user.channelMemberID]);

        const _id = permissions.id;

        Object.keys(permissions)
          .forEach((k) => {
            permissions[k] = !!permissions[k];
          });

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

    const joinedRoom = obj.room;

    socket.leave(room);

    user?.setChannel(joinedRoom, async (err) => {
      if (err) {
        console.log(clc.yellow(err));
      } else {
        socket.join(joinedRoom);
        room = joinedRoom;
      }
    });
  });

  socket.on("message", (msg) => {

    user?.hasPermission(permissions.sendMessages, async (err) => {
      if (err) {
        console.log(clc.yellow(err));
      } else {

        try {

          const chMsg = await REPQuery.one(
          `
          INSERT INTO CHANNELS_MESSAGES
          (ID_CHANNEL, ID_CHANNEL_MEMBER, MESSAGE, DATE)
          VALUES
          (?, ?, ?, ?)
          RETURNING ID_CHANNEL_MESSAGE
          `, [user.channelID, user.channelMemberID, msg, new Date()]);

          const message = await REPQuery.one(
          `
          SELECT
          M.ID_CHANNEL_MESSAGE as id,
          U.USER_CODE as code,
          U.COLOR as color,
          U.NAME as name,
          CM.ID_CHANNEL_MEMBER as author,
          TO_BASE64(U.PROFILE_PICTURE) as picture,
          M.MESSAGE as message,
          M.DATE as date
          FROM CHANNELS_MESSAGES M
          LEFT JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL_MEMBER = M.ID_CHANNEL_MEMBER
          LEFT JOIN USERS U ON U.ID_USER = CM.ID_USER
          WHERE M.ID_CHANNEL_MESSAGE = ?
          `, [chMsg.ID_CHANNEL_MESSAGE]);

          io.to(room).emit("message", JSON.stringify(message));
        } catch (error) {
          console.log(error);
        }
      }
    });

  });

  socket.on("deleteMessage", (msgID) => {

    // Checks if the message being delete belongs to the user
    user?.msgBelong(msgID, (noAuth) => {

      const delMsg = async () => {
        try {
          await REPQuery.exec(
          `
          DELETE FROM CHANNELS_MESSAGES 
          WHERE ID_CHANNEL_MESSAGE = ?
          `, [msgID]);

          io.to(room).emit("deleteMessage", `${msgID}`);

        } catch (error) {
          console.log(clc.red(error));
        }
      }

      if (noAuth) {
        // If the message does not belong to the user then the latter
        // must be authorized to delete other people messages
        user?.hasPermission(permissions.deleteMessage, async (err, user) => {
          if (err) {
            console.log(clc.red(err));
          } else {
            delMsg();
          }
        });
      } else {
        delMsg();
      }
    });

  });

});



module.exports = router;