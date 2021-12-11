const express        = require('express');
const Auth           = require('../Authentication/auth');
const router         = express.Router();
const db             = require('../Database/db');
const multer         = require('multer');
const upload         = multer({});
const fm             = require('date-fns');
const socket         = require('../start');


router.post('/createChannel', [Auth.authToken, upload.single("image")], async (req, res) => {

  try {

    const channel = {
      name: req.body.name,
      picture: req.body.picture
    };

    const creationDate = fm.format(new Date(res.locals._requestDate));
    
    let _channelID = await db.query(
    `
    INSERT INTO CHANNELS
    (NAME, PICTURE, CREATION_DATE)
    VALUES
    (?, ?, ?)
    RETURNING ID_CHANNEL
    `, [channel.name, channel.picture, creationDate]);

    _channelID = _channelID[0].ID_CHANNEL;

    const _userID = res.locals._id;

    await db.query(
    `
    INSERT INTO CHANNELS_MEMBERS
    (ID_USER, ID_CHANNEL, PERMISSION)
    VALUES
    (?, ?, ?)
    `, [_userID, _channelID, 0]);

    res.status(201).send({ success: true });
  } catch (err) {
    console.log(err);
    
    res.status(500).send({ success: false, message: `Database error!` });
  }

});


module.exports = router;