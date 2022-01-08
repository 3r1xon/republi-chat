const express        = require('express');
const Auth           = require('../Authentication/auth');
const REPTools       = require('../Tools/rep-tools');
const router         = express.Router();
const db             = require('../Database/db');
const multer         = require('multer');
const upload         = multer({});
const fm             = require('date-fns');
const socket         = require('../start');
const DBUser = require('../Authentication/db-user');



router.use(Auth.authToken);



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

        let _channelID = await db.query(
        `
        INSERT INTO CHANNELS
        (ID_USER, NAME, CHANNEL_CODE, PICTURE, CREATION_DATE)
        VALUES
        (?, ?, ?, ?, ?)
        RETURNING ID_CHANNEL
        `, [_userID, channel.name, code, channel.picture, creationDate]);

        _channelID = _channelID[0].ID_CHANNEL;

        let _channelMemberID = await db.query(
        `
        INSERT INTO CHANNELS_MEMBERS
        (ID_USER, ID_CHANNEL)
        VALUES
        (?, ?)
        RETURNING ID_CHANNEL_MEMBER
        `, [_userID, _channelID]);

        _channelMemberID = _channelMemberID[0].ID_CHANNEL_MEMBER;

        await db.query(
        `
        INSERT INTO CHANNELS_PERMISSIONS
        (ID_CHANNEL_MEMBER)
        VALUES
        (?)
        `, [_channelMemberID]);

        res.status(201).send({ success: true });

      } catch(error) {
        console.log(error);

        res.status(500).send({ success: false, message: `Database error!` });
      }
    }
  });
});



router.post('/addChannel', async (req, res) => {

  const { name, code } = req.body;
  const _userID        = res.locals._id;

  let channel = await db.query(
  `
  SELECT 
  ID_CHANNEL
  FROM CHANNELS
  WHERE NAME = ? AND CHANNEL_CODE = ?
  `, [name, code]);

  channel = channel[0];

  if (channel) {

    const _channelID = channel.ID_CHANNEL;

    const user = new DBUser(_userID);

    user.setChannel(_channelID, async (err, user) => {
      if (err) {
        // It means the user is not in the desired channel so it can be added
        let member = await db.query(
        `
        INSERT INTO CHANNELS_MEMBERS
        (ID_USER, ID_CHANNEL)
        VALUES
        (?, ?)
        RETURNING ID_CHANNEL_MEMBER
        `, [_userID, _channelID]);

        member = member[0].ID_CHANNEL_MEMBER

        await db.query(
        `
        INSERT INTO CHANNELS_PERMISSIONS
        (ID_CHANNEL_MEMBER)
        VALUES
        (?)
        `, [member]);

        res.status(201).send({ success: true });

      } else {

        res.status(409).send({ success: false, message: "User already in channel!" });
      }
    });
  } else
  res.status(404).send({ success: false, message: "Inputed channel does not exist!" });
});



router.get('/getChannels', async (req, res) => {

  try {

    const _id = res.locals._id;

    const channels = await db.query(
    `
    SELECT
    C.ID_CHANNEL as _id,
    C.NAME as name,
    C.CHANNEL_CODE as message,
    C.PICTURE as picture
    FROM CHANNELS_MEMBERS CM
    LEFT JOIN CHANNELS C ON C.ID_CHANNEL = CM.ID_CHANNEL
    WHERE CM.ID_USER = ?
    `, [_id]);

    res.status(200).send({ success: true, data: channels });

  } catch (error) {
    console.log(error);

    res.status(500).send({ success: false, message: `Database error!` });
  }

});


module.exports = router;