const express        = require('express');
const Auth           = require('../Authentication/auth');
const router         = express.Router();
const db             = require('../Database/db');
const fm             = require('date-fns');
const io         = require('../start');
const DBUser         = require('../Authentication/db-user');



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
        LEFT JOIN CHANNELS C ON CM.ID_CHANNEL = M.ID_CHANNEL
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

  socket.on("joinChannel", (obj) => {

    const { userID, room } = obj;

    const user = new DBUser(userID);

    user.setChannel(room, async (err, user) => {
      if (err) {
        console.log("Not authorized");
      } else {

        socket.on("message", async (msg) => {

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
        
          socket.emit("message", JSON.stringify(message));
        });
      }
    });

  });
});



// router.post('/sendMessage', async (req, res) => {

//   const msg = {
//     id_user: res.locals._id,
//     message: req.body.message,
//     date: fm.format(res.locals._requestDate, 'yyyy-MM-dd HH:mm')
//   };

//   const user = new DBUser(msg.id_user);

//   const _channelID = req.body._channelID;

//   user.setChannel(_channelID, async (err, user) => {
//     if (err) {

//     } else {

//       let _id = await db.query(
//       `
//       INSERT INTO CHANNELS_MESSAGES
//       (ID_CHANNEL, ID_CHANNEL_MEMBER, MESSAGE, DATE)
//       VALUES
//       (?, ?, ?, ?)
//       RETURNING ID_CHANNEL_MESSAGE
//       `, [user.channelID, user.channelMemberID, msg.message, msg.date]);
    
//       _id = _id[0].ID_CHANNEL_MESSAGE;
    
//       let message = await db.query(
//       `
//       SELECT
//       M.ID_CHANNEL_MESSAGE as id,
//       U.USER_CODE as code,
//       U.COLOR as color,
//       U.NAME as name,
//       TO_BASE64(U.PROFILE_PICTURE) as picture,
//       M.MESSAGE as message,
//       M.DATE as date
//       FROM CHANNELS_MESSAGES M
//       LEFT JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL_MEMBER = M.ID_CHANNEL_MEMBER
//       LEFT JOIN USERS U ON U.ID_USER = CM.ID_USER
//       WHERE M.ID_CHANNEL_MESSAGE = ?
//       `, [_id]);
    
//       message = message[0];
    
//       io.emit("message", JSON.stringify(message));
    
//       res.status(201).send({ success: true });
//     }
//   })

// });



router.delete('/deleteMessage', async (req, res) => {

  try {
    const id_message = req.body._id;

    await db.query(
    `
    DELETE FROM CHANNELS_MESSAGES 
    WHERE ID_CHANNEL_MESSAGE = ?
    `, [id_message]);

    io.emit("deleteMessage", `${id_message}`);

    res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);

    res.status(500).send({ success: false, message: "Database error!" });
  }

});


module.exports = router;