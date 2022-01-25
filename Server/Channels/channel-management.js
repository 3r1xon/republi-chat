const express        = require('express');
const Auth           = require('../Authentication/auth');
const REPTools       = require('../Tools/rep-tools');
const router         = express.Router();
const REPQuery       = require('../Database/rep-query');
const multer         = require('multer');
const upload         = multer({});
const fm             = require('date-fns');
const io             = require('../start');
const clc            = require('cli-color');
const DBUser         = require('../Authentication/db-user');
const permissions    = require('../Authentication/permissions');


router.use(Auth.HTTPAuthToken);



router.post('/createChannel', upload.single("image"), async (req, res) => {

  const channel = {
    name: req.body.name,
    picture: req.body.picture
  };

  const creationDate = fm.format(res.locals._requestDate, 'yyyy-MM-dd HH:mm');

  await REPTools.generateCode(channel.name, "CHANNELS", "CHANNEL_CODE", async (err, code) => {
    if (err) {
      res.status(409).send({
        success: false,
        message: `Too many channels are using the name "${channel.name}". Try another name.`
      });
    } else {
      try {

        const _userID = res.locals._id;

        const dbChannel = await REPQuery.one(
        `
        INSERT INTO CHANNELS
        (ID_USER, NAME, CHANNEL_CODE, PICTURE, CREATION_DATE)
        VALUES
        (?, ?, ?, ?, ?)
        RETURNING ID_CHANNEL
        `, [_userID, channel.name, code, channel.picture, creationDate]);

        const chMember = await REPQuery.one(
        `
        INSERT INTO CHANNELS_MEMBERS
        (ID_USER, ID_CHANNEL)
        VALUES
        (?, ?)
        RETURNING ID_CHANNEL_MEMBER
        `, [_userID, dbChannel.ID_CHANNEL]);

        await REPQuery.exec(
        `
        INSERT INTO CHANNELS_PERMISSIONS
        (ID_CHANNEL_MEMBER, DELETE_MESSAGE, KICK_MEMBERS, BAN_MEMBERS, SEND_MESSAGES)
        VALUES
        (?, ?, ?, ?, ?)
        `, [chMember.ID_CHANNEL_MEMBER, true, true, true, true]);

        res.status(201).send({ success: true });

      } catch(error) {
        console.log(clc.red(error));

        res.status(500).send({ success: false, message: `Internal server error!` });
      }
    }
  });
});



router.post('/addChannel', async (req, res) => {

  const { name, code } = req.body;
  const _userID        = res.locals._id;

  try {

    const channel = await REPQuery.one(
    `
    SELECT 
    ID_CHANNEL
    FROM CHANNELS
    WHERE NAME = ? AND CHANNEL_CODE = ?
    `, [name, code]);

    if (channel) {

      const _channelID = channel.ID_CHANNEL;

      const user = new DBUser(_userID);

      user.setChannel(_channelID, async (err, user) => {
        if (err) {
          // It means the user is not in the desired channel so it can be added
          const member = await REPQuery.one(
          `
          INSERT INTO CHANNELS_MEMBERS
          (ID_USER, ID_CHANNEL)
          VALUES
          (?, ?)
          RETURNING ID_CHANNEL_MEMBER
          `, [_userID, _channelID]);

          await REPQuery.exec(
          `
          INSERT INTO CHANNELS_PERMISSIONS
          (ID_CHANNEL_MEMBER)
          VALUES
          (?)
          `, [member.ID_CHANNEL_MEMBER]);

          res.status(201).send({ success: true });

        } else {

          res.status(409).send({ success: false, message: "User already in channel!" });
        }
      });
    } else
    res.status(404).send({ success: false, message: "Inputed channel does not exist!" });
  } catch(err) {
    console.log(clc.red(error));
    res.status(500).send({ success: false, message: "Internal server error!" });
  }

});



router.get('/getChannels', async (req, res) => {

  try {

    const _id = res.locals._id;

    const channels = await REPQuery.load(
    `
    SELECT
    C.ID_CHANNEL as _id,
    C.NAME as name,
    C.CHANNEL_CODE as message,
    C.PICTURE as picture
    FROM CHANNELS C
    LEFT JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL = C.ID_CHANNEL
    WHERE CM.ID_USER = ?
    AND CM.BANNED = ?
    AND CM.KICKED = ?
    `, [_id, false, false]);

    res.status(200).send({ success: true, data: channels });

  } catch (error) {
    console.log(clc.red(error));
    res.status(500).send({ success: false, message: `Internal server error!!` });
  }

});



io.on("connection", (socket) => { 

  const userID = socket.auth._id;

  const user = new DBUser(userID);

  socket.on("ban", (chInfo) => {
    const rqRoom = chInfo.room;
    const _memberID = chInfo._id;

    user.setChannel(rqRoom, (err) => {
      if (err) {
        console.log(clc.red(err));
      } else {

        user.hasPermission(permissions.banMembers, async (err) => {
          if (err) {
            console.log(clc.red(err));
          } else {

            if (user.channelMemberID != _memberID) {
              try {
                // await REPQuery.exec(
                // `
                // UPDATE 
                // CHANNELS_MEMBERS
                // SET
                // BANNED = ?
                // WHERE ID_CHANNEL_MEMBER = ?
                // AND ID_CHANNEL = ?
                // `, [true, _memberID, rqRoom]);

                const user = await REPQuery.one(
                `
                SELECT
                ID_USER
                FROM CHANNELS_MEMBERS
                WHERE ID_CHANNEL_MEMBER = ?
                `, [_memberID]);

                const socketIDs = await REPQuery.load(
                `
                SELECT
                SOCKET_ID
                FROM SESSIONS
                WHERE ID_USER = ?
                `, [user.ID_USER]);

                io.to(rqRoom).emit("ban", _memberID);

                socketIDs?.map((id) => {
                  console.log(id.SOCKET_ID);
                  console.log(io.sockets.adapter.rooms[id.SOCKET_ID]);
                  // const wsUser = io.sockets.clients(id.SOCKET_ID);
                  // // io.to(id).emit("ban", _memberID);
                  // wsUser.leave(rqRoom);
                });

              } catch(error) {
                console.log(clc.red(error));
              }
            }
          }
        });
      }
    });

  });



  socket.on("kick", (chUserID) => {

  });
})


module.exports = router;