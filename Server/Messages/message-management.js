const express        = require('express');
const Auth           = require('../Authentication/auth');
const router         = express.Router();
const db             = require('../Database/db');
const fm             = require('date-fns');
const io             = require('../start');
const DBUser         = require('../Authentication/db-user');
const permissions    = require('../Authentication/permissions');



router.use(Auth.authToken);



router.get('/getChannelMessages/:id', async (req, res) => {

  const _id        = res.locals._id;
  const _channelID = req.params.id;
  const user       = new DBUser(_id);

  user.setChannel(_channelID, async (err, user) => {
    if (err) {
      res.status(401).send({ success: false, message: "User not in channel!" });
    } else {

      try {
        const messages = await db.query(
        `
        SELECT
        M.ID_CHANNEL_MESSAGE as id,
        U.COLOR as color,
        U.NAME as name,
        TO_BASE64(U.PROFILE_PICTURE) as picture,
        M.MESSAGE as message,
        M.DATE as date,
        IF(U.ID_USER = ?, TRUE, FALSE) as auth
        FROM CHANNELS_MESSAGES M
        LEFT JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL_MEMBER = M.ID_CHANNEL_MEMBER
        LEFT JOIN CHANNELS C ON C.ID_CHANNEL = M.ID_CHANNEL
        LEFT JOIN USERS U ON U.ID_USER = CM.ID_USER
        WHERE C.ID_CHANNEL = ?
        `, [_id, _channelID]);

        res.status(200).send({ success: true, data: messages });
      }
      catch (error) {
        console.log(error);

        res.status(500).send({ success: false, message: "Database error!" });
      }
    }
  });
});



io.on("connection", (socket) => {

  let room;

  let user;

  socket.on("joinChannel", (obj) => {

    const { userID } = obj;

    const joinedRoom = obj.room;

    user = new DBUser(userID);

    socket.leave(room);

    socket.join(joinedRoom);

    user?.setChannel(joinedRoom, async (err, user) => {
      if (err) {
        console.log(err);
      } else {
        room = joinedRoom;
      }
    });
  });

  socket.on("message", (msg) => {

    user?.hasPermission(permissions.sendMessages, async (err, user) => {
      if (err) {
        socket.disconnect();
        console.log(err);
      } else {

        try {

          let _id = await db.query(
          `
          INSERT INTO CHANNELS_MESSAGES
          (ID_CHANNEL, ID_CHANNEL_MEMBER, MESSAGE, DATE)
          VALUES
          (?, ?, ?, ?)
          RETURNING ID_CHANNEL_MESSAGE
          `, [user.channelID, user.channelMemberID, msg, new Date()]);

          _id = _id[0].ID_CHANNEL_MESSAGE;
    
          let message = await db.query(
          `
          SELECT
          M.ID_CHANNEL_MESSAGE as id,
          U.USER_CODE as code,
          U.COLOR as color,
          U.NAME as name,
          TO_BASE64(U.PROFILE_PICTURE) as picture,
          M.MESSAGE as message,
          M.DATE as date
          FROM CHANNELS_MESSAGES M
          LEFT JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL_MEMBER = M.ID_CHANNEL_MEMBER
          LEFT JOIN USERS U ON U.ID_USER = CM.ID_USER
          WHERE M.ID_CHANNEL_MESSAGE = ?
          `, [_id]);

          message = message[0];

          io.to(room).emit("message", JSON.stringify(message));
        } catch (error) {
          console.log(error);
        }
      }
    });

  });

  socket.on("deleteMessage", (msgID) => {

    // Checks if the message being delete belongs to the user
    user?.msgBelong(msgID, (err, user) => {

      const delMsg = async () => {
        try {
          await db.query(
          `
          DELETE FROM CHANNELS_MESSAGES 
          WHERE ID_CHANNEL_MESSAGE = ?
          `, [msgID]);

          io.to(room).emit("deleteMessage", `${msgID}`);

        } catch (error) {
          console.log(error);
        }
      }

      if (err) {
        // If the message does not belong to the user then the latter
        // must be authorized to delete other people messages
        user?.hasPermission(permissions.deleteMessage, async (err, user) => {
          if (err) {
            console.log(err);
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