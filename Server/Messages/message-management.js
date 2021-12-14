const express        = require('express');
const Auth           = require('../Authentication/auth');
const router         = express.Router();
const db             = require('../Database/db');
const fm             = require('date-fns');
const socket         = require('../start');



router.use(Auth.authToken);



router.get('/getChannelMessages/:id', async (req, res) => {

  try {

    const _id = res.locals._id;

    const _channelID = 0;

    let messages = await db.query(
    `
    SELECT
    M.ID_MESSAGE as id,
    U.COLOR as color,
    U.NAME as name,
    TO_BASE64(U.PROFILE_PICTURE) as picture,
    M.MESSAGE as message,
    M.DATE as date,
    IF(U.ID_USER = ?, TRUE, FALSE) as auth
    FROM CHANNELS_MESSAGES M
    LEFT JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL = M.ID_CHANNEL
    LEFT JOIN CHANNELS C ON CM.ID_CHANNEL = M.ID_CHANNEL
    LEFT JOIN USERS U ON U.ID_USER = CM.ID_USER
    WHERE C.ID_CHANNEL = ?
    `, [_id, _channelID]);
  
    res.status(200).send({ success: true, data: messages });
  } catch (err) {

    console.log(err);

    res.status(500).send({ success: false, message: "Database error!" });
  }

});


/*
router.post('/sendMessage', async (req, res) => {

  const msg = {
    id_user: res.locals._id,
    message: req.body.message,
    date: fm.format(new Date(res.locals._requestDate), 'yyyy-MM-dd HH:mm')
  };

  const _channelID = req.body._channelID;

  try {
    let _id = await db.query(
    `
    INSERT INTO CHANNELS_MESSAGES
    (ID_CHANNEL, ID_MEMBER, MESSAGE, DATE)
    VALUES
    (?, ?, ?)
    RETURNING ID_MESSAGE
    `, [_channelID, msg.id_user, msg.message, msg.date]);

    _id = _id[0].ID_MESSAGE;

    let message = await db.query(
    `
    SELECT 
    M.ID_MESSAGE as id,
    U.USER_CODE as code,
    U.COLOR as color,
    U.NAME as name,
    TO_BASE64(U.PROFILE_PICTURE) as picture,
    M.MESSAGE as message,
    M.DATE as date
    FROM CHANNELS_MESSAGES M
    LEFT JOIN USERS U ON U.ID_USER = M.ID_USER
    WHERE M.ID_MESSAGE = ?
    ORDER BY M.ID_MESSAGE DESC
    `, [_id]);

    message = message[0];

    socket.emit("message", JSON.stringify(message));

    res.status(201).send({ success: true });
  } catch (err) {
    console.log(err);
    
    res.status(500).send({ success: false, message: `Database error!` });
  }
});
*/

/*
router.delete('/deleteMessage', async (req, res) => {

  try {
    const id_message = req.body._id;

    await db.query(
    `
    DELETE FROM CHANNELS_MESSAGES 
    WHERE ID_MESSAGE = ?
    `, [id_message]);

    socket.emit("deleteMessage", `${id_message}`);

    res.status(200).send({ success: true });
  } catch (err) {
    console.log(err);

    res.status(500).send({ success: false, message: "Database error!" });
  }

});
*/


module.exports = router;