const express        = require('express');
const Auth           = require('../Authentication/auth');
const router         = express.Router();
const db             = require('../Database/db');
const fm             = require('date-fns');



router.post('/sendMessage', Auth.authToken, async (req, res) => {

  const msg = {
    id_user: res.locals._id,
    userMessage: req.body.userMessage,
    date: fm.format(new Date(req.body.date), 'yyyy-MM-dd HH:mm')
  };

  try {
    await db.promise().query(
    `
    INSERT INTO MESSAGES 
    (ID_USER, MESSAGE, DATE) 
    VALUES 
    (?, ?, ?)
    `, [msg.id_user, msg.userMessage, msg.date]);

    let id = await db.promise().query(
    `
    SELECT LAST_VALUE(ID_MESSAGE) AS ID_MESSAGE
    FROM MESSAGES 
    WHERE ID_USER = ?
    ORDER BY ID_MESSAGE DESC
    `, [msg.id_user]);

    id = id[0][0].ID_MESSAGE;

    res.status(201).send({ success: true, data: id });
  } catch (err) {
    console.log(err);
    
    res.status(500).send({ success: false, message: `Database error!` });
  }
});


router.get('/getMessages', Auth.authToken, async (req, res) => {

  try {

    let messages = await db.promise().query(
    `
    SELECT
    M.ID_MESSAGE as id,
    U.COLOR as userColor,
    U.NICKNAME as userName,
    TO_BASE64(U.PROFILE_PICTURE) as userImage,
    M.MESSAGE as userMessage,
    M.DATE as date
    FROM MESSAGES M
    LEFT JOIN USERS U ON U.ID_USER = M.ID_USER
    `);

    messages = messages[0];
  
    res.status(200).send({ success: true, data: messages });
  } catch (err) {

    console.log(err);

    res.status(500).send({ success: false, message: "Database error!" });
  }

});






router.delete('/deleteMessage', Auth.authToken, async (req, res) => {

  try {
    const id_message = req.body.id_message;

    await db.promise().query(
    `
    DELETE FROM MESSAGES 
    WHERE ID_MESSAGE = ?
    `, [id_message]);

    res.status(200).send({ success: true });
  } catch (err) {
    console.log(err);

    res.status(500).send({ success: false, message: "Database error!" });
  }

});



module.exports = router;