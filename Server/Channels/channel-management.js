const express           = require('express');
const Auth              = require('../Authentication/auth');
const REPTools          = require('../Tools/rep-tools');
const router            = express.Router();
const REPQuery          = require('../Database/rep-query');
const multer            = require('multer');
const upload            = multer({});
const fm                = require('date-fns');
const clc               = require('cli-color');
const DBUser            = require('../Authentication/db-user');
const { channelSchema } = require('../Tools/schemas');
const { io }            = require('../start');


router.use(Auth.HTTPAuthToken);



router.post('/createChannel', upload.single("image"), async (req, res) => {

  const channel = {
    name: req.body.name,
    picture: req.body.picture
  };

  const { error } = channelSchema.validate(channel);

  if (error) {
    res.status(400).send({ success: false, message: `Invalid payload, schema error!` });

    return;
  }

  const creationDate = fm.format(new Date(), 'yyyy-MM-dd HH:mm');

  await REPTools.generateCode(channel.name, "CHANNELS", "CHANNEL_CODE", async (err, code) => {
    if (err) {
      res.status(409).send({
        success: false,
        message: `Too many channels are using the name "${channel.name}". Try another name.`
      });
    } else {
      try {

        const userID = res.locals._id;

        const newChannel = await REPQuery.one(
        `
        INSERT INTO CHANNELS
            (ID_USER, NAME, CHANNEL_CODE, PICTURE, CREATION_DATE, BACKGROUND_COLOR)
        VALUES (?, ?, ?, ?, ?, ?)
        RETURNING ID_CHANNEL as id, NAME as name, CHANNEL_CODE as code, PICTURE as picture, COLOR as color, BACKGROUND_COLOR as backgroundColor
        `, [userID, channel.name, code, channel.picture, creationDate, REPTools.randomHex()]);

        // Triggers will take care of the rest

        res.status(201).send({ success: true, data: newChannel });

      } catch(error) {
        console.log(clc.red(error));

        res.status(500).send({ success: false, message: `Internal server error!` });
      }
    }
  });
});



router.post('/addChannel', async (req, res) => {

  const { name, code } = req.body;
  const userID         = res.locals._id;

  try {

    // Name and channel code are not selected
    // but added to the object later
    const channel = await REPQuery.one(
    `
    SELECT ID_CHANNEL       as id,
           PICTURE          as picture,
           COLOR            as color,
           BACKGROUND_COLOR as backgroundColor
    FROM CHANNELS
    WHERE NAME = ?
      AND CHANNEL_CODE = ?
    `, [name, code]);

    if (channel) {

      const channelID = channel.id;

      const user = new DBUser(userID);

      user.setChannel(channelID, async (err, user) => {
        if (err) {
          // It means the user is not in the desired channel so it can be added

          const exists_pending = await REPQuery.one(
          `
          SELECT 1
          FROM CHANNELS_PENDINGS CP
          WHERE CP.ID_CHANNEL = ?
            AND CP.ID_USER = ?
          `, [channelID, userID]);

          if (exists_pending)
            return res.status(409).send({ success: false, message: "User already in pending list!" });

          await REPQuery.exec(
          `
          INSERT INTO CHANNELS_PENDINGS
              (ID_CHANNEL, ID_USER)
          VALUES (?, ?)
          `, [channelID, userID]);

          const user_data = await REPQuery.one(
          `
          SELECT U.USER_CODE        as code,
                 U.PROFILE_PICTURE  as picture,
                 U.COLOR            as color,
                 U.BACKGROUND_COLOR as backgroundColor,
                 U.NAME             as name
          FROM USERS U
          WHERE U.ID_USER = ?
          `, [userID]);

          io.to(`ch${channelID}`).emit("pendings", {
            id: userID,
            ...user_data
          });

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

    const userID = res.locals._id;

    const channels = await REPQuery.load(
    `
    SELECT C.ID_CHANNEL       as id,
           C.NAME             as name,
           C.CHANNEL_CODE     as code,
           C.PICTURE          as picture,
           C.COLOR            as color,
           C.BACKGROUND_COLOR as backgroundColor
    FROM CHANNELS C
             INNER JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL = C.ID_CHANNEL
    WHERE CM.ID_USER = ?
      AND CM.BANNED = ?
      AND CM.KICKED = ?
    ORDER BY CM.ORDER
    `, [userID, false, false]);

    res.status(200).send({ success: true, data: channels });

  } catch (error) {
    console.log(clc.red(error));
    res.status(500).send({ success: false, message: `Internal server error!` });
  }

});



router.get('/getChannelInfo/:id', (req, res) => {

  try {

    const userID = res.locals._id;

    const channelID = req.params.id;

    const user = new DBUser(userID);

    user.setChannel(channelID, async (err) => {
      if (err) {
        res.status(401).send({ success: false, message: "User not in channel!" });
      } else {

        const rooms = await REPQuery.load(
        `
        SELECT CR.ID_CHANNEL_ROOM   as roomID,
               CR.ROOM_NAME         as roomName,
               CR.TEXT_ROOM         as textRoom,
               CR.AUTO_JOIN         as autoJoin,
               CRMB.UNREAD_MESSAGES as notifications
        FROM CHANNELS_ROOMS CR
                INNER JOIN CHANNELS_ROOMS_MEMBERS CRMB ON CRMB.ID_CHANNEL_ROOM = CR.ID_CHANNEL_ROOM
                INNER JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL_MEMBER = CRMB.ID_CHANNEL_MEMBER
        WHERE CR.ID_CHANNEL = ?
          AND CM.ID_USER = ?
        `, [channelID, userID]);

        const permissions = await REPQuery.one(
        `
        SELECT DELETE_MESSAGES as deleteMessage,
               KICK_MEMBERS    as kickMembers,
               BAN_MEMBERS     as banMembers,
               SEND_MESSAGES   as sendMessages,
               CREATE_ROOMS    as createRooms,
               ACCEPT_MEMBERS  as acceptMembers
        FROM CHANNELS_PERMISSIONS
        WHERE ID_CHANNEL_MEMBER = ?
        `, [user.channelMemberID]);

        const pendings = await REPQuery.load(
        `
        SELECT U.ID_USER                    as id,
               U.USER_CODE                  as code,
               U.COLOR                      as color,
               U.BACKGROUND_COLOR           as backgroundColor,
               U.NAME                       as name,
               TO_BASE64(U.PROFILE_PICTURE) as picture
        FROM CHANNELS_PENDINGS CP
                 LEFT JOIN USERS U ON CP.ID_USER = U.ID_USER
        WHERE CP.ID_CHANNEL = ?
        `, [channelID]);

        REPTools.keysToBool(permissions);

        permissions.id = user.channelMemberID;

        res.status(200).send({
          success: true,
          data: {
            rooms: rooms,
            permissions: permissions,
            pendings: pendings
          }
        });
      }
    })

  } catch (error) {
    console.log(clc.red(error));

    res.status(500).send({ success: false, message: `Internal server error!!` });
  }

});



router.get('/getChRoomInfo/:chID/:roomID', (req, res) => {

  try {

    const userID = res.locals._id;

    const channelID = req.params.chID;

    const roomID = req.params.roomID;

    const user = new DBUser(userID);

    user.setChannel(channelID, (chErr) => {
      if (chErr) {
        res.status(401).send({ success: false, message: "User not in channel!" });
      } else {

        user.setRoom(roomID, async (roomError) => {
          if (roomError) {
            res.status(401).send({ success: false, message: "User not in room!" });
          } else {

            const permissions = await REPQuery.one(
            `
            SELECT SEND_MESSAGES   as sendMessages,
                   DELETE_MESSAGES as deleteMessages
            FROM CHANNELS_ROOMS_PERMISSIONS
            WHERE ID_CHANNEL_ROOM_MEMBER = ?
            `, user.roomMemberID);

            const members = await REPQuery.load(
            `
            SELECT U.ID_USER                    as id,
                   U.USER_CODE                  as code,
                   U.COLOR                      as color,
                   U.BACKGROUND_COLOR           as backgroundColor,
                   U.NAME                       as name,
                   TO_BASE64(U.PROFILE_PICTURE) as picture,
                   U.USER_STATUS                as userStatus
            FROM CHANNELS_ROOMS_MEMBERS CRMB
                     INNER JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL_MEMBER = CRMB.ID_CHANNEL_MEMBER
                     INNER JOIN USERS U ON U.ID_USER = CM.ID_USER
            WHERE CRMB.ID_CHANNEL_ROOM = ?
            `, [roomID]);

            REPTools.keysToBool(permissions);

            permissions.id = user.roomMemberID;

            res.status(200).send(
              {
                success: true,
                data: {
                  permissions: permissions,
                  members: members
                }
              });
          }
        });

      }
    })

  } catch (error) {
    console.log(clc.red(error));

    res.status(500).send({ success: false, message: `Internal server error!` });
  }

});



router.post('/addChRoom', (req, res) => {

  try {
    const userID    = res.locals._id;
    const user      = new DBUser(userID);
    const channelID = req.body.id;

    user.setChannel(channelID, (err) => {
      if (err) {
        res.status(401).send({ success: false, message: "User not in channel!" });
      } else {

        const room = req.body;

        user.addRoom(room, (err) => {
          if (err) {
            res.status(401).send({ success: false, message: err });
          } else {
            res.status(200).send({ success: true });
          }
        });
      }
    });

  } catch (error) {
    console.log(clc.red(err));

    res.status(500).send({ success: false, message: "Internal server error!" });
  }

});



router.delete('/deleteRoom/:channelID/:roomID', (req, res) => {

  try {
    const userID    = res.locals._id;
    const user      = new DBUser(userID);
    const channelID = req.params.channelID;

    user.setChannel(channelID, (err) => {
      if (err) {
        res.status(401).send({ success: false, message: "User not in channel!" });
      } else {

        const roomID = req.params.roomID;

        user.deleteRoom(roomID, (err) => {
          if (err) {
            res.status(401).send({ success: false, message: err });
          } else {
            res.status(200).send({ success: true });
          }
        });

      }
    });

  } catch (error) {
    console.log(clc.red(err));

    res.status(500).send({ success: false, message: "Internal server error!" });
  }

});



router.put('/changePendingStatus', (req, res) => {

  try {
    const userID    = res.locals._id;
    const pendingID = req.body.pendingID;
    const channelID = req.body.chID;
    const user      = new DBUser(userID);

    user.setChannel(channelID, async (chErr) => {
      if (chErr) {
        res.status(401).send({ success: false, message: "User not in channel!" });
      } else {

        const status = req.body.status;

        await REPQuery.exec(
        `
        UPDATE CHANNELS_PENDINGS CP
        SET CP.ACCEPTED = ?
        WHERE CP.ID_CHANNEL = ?
          AND CP.ID_USER = ?
        `, [status, channelID, pendingID]);

        await REPQuery.exec(
        `
        DELETE
        FROM CHANNELS_PENDINGS
        WHERE ID_CHANNEL = ?
          AND ID_USER = ?
        `, [channelID, pendingID]);

        if (status) {

          const new_user = await REPQuery.one(
          `
          SELECT U.USER_CODE        as code,
                 U.PROFILE_PICTURE  as picture,
                 U.COLOR            as color,
                 U.BACKGROUND_COLOR as backgroundColor,
                 U.NAME             as name,
                 U.USER_STATUS      as userStatus
          FROM USERS U
          WHERE U.ID_USER = ?
          `, [pendingID]);

          io.to(`ch${channelID}`).emit("members", {
            id: pendingID,
            emitType: "NEW_MEMBER",
            code: new_user.code,
            picture: new_user.picture,
            color: new_user.color,
            backgroundColor: new_user.backgroundColor,
            name: new_user.name,
            userStatus: new_user.userStatus
          });

          const channel = await REPQuery.one(
          `
          SELECT C.ID_CHANNEL       as id,
                 C.NAME             as name,
                 C.CHANNEL_CODE     as code,
                 C.PICTURE          as picture,
                 C.COLOR            as color,
                 C.BACKGROUND_COLOR as backgroundColor
          FROM CHANNELS C
          WHERE C.ID_CHANNEL = ?
          `, [channelID]);

          io.to(`user${pendingID}`).emit("channels", {
            id: channel.id,
            emitType: "NEW_CHANNEL",
            name: channel.name,
            code: channel.code,
            picture: channel.picture,
            color: channel.color,
            backgroundColor: channel.backgroundColor
          });

        }

        res.status(200).send({ success: true });
      }

    });
  } catch (error) {
    console.log(clc.red(error));

    res.status(500).send({ success: false, message: `Internal server error!` });
  }

});



router.get('/getRoomMessages/:chID/:roomID/:limit', (req, res) => {

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
                     LEFT JOIN CHANNELS_ROOMS_MEMBERS CRMB ON CRMB.ID_CHANNEL_ROOM_MEMBER = CRM.ID_CHANNEL_ROOM_MEMBER
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
    }
  });
});


router.put('/changeChOrder', async (req, res) => {

  try {

    const channels = req.body;
    const userID = res.locals._id;

    let i = 0;
    for (const channel of channels) {
      await REPQuery.exec(
      `
      UPDATE CHANNELS_MEMBERS CM
      SET CM.ORDER = ?
      WHERE CM.ID_USER = ?
        AND CM.ID_CHANNEL = ?
      `, [i, userID, channel.id]);
      i++;
    }

    res.status(200).send({ success: true });

  }
  catch(error) {
    console.log(clc.red(error));

    res.status(500).send({ success: false, message: "Internal server error!" });
  }
});



router.put('/changeRoomsOrder', async (req, res) => {

  try {

    const rooms = req.body;
    const userID = res.locals._id;



  } catch(error) {
    console.log(clc.red(error));

    res.status(500).send({ success: false, message: "Internal server error!" });
  }

});


module.exports = router;