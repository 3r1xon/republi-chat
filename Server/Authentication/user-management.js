const express        = require('express');
const router         = express.Router();
const Auth           = require('./auth');
const multer         = require('multer');
const upload         = multer({});
const db             = require('../Database/db');
const nanoid         = require('nanoid');


router.post('/signUp', async (req, res) => {
  
  const user = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  };

  if (user.userName == '' || user.password == '' || user.name == '')
    res.status(400).send({ success: false, message: 'Username or password invalid' });
  else {

    try {

      let dbValue = await db.query(
      `
      SELECT
      USER_CODE
      FROM USERS
      WHERE NAME = ?
      ORDER BY ID_USER DESC
      LIMIT 1
      `, [user.name]);

      dbValue = dbValue[0].USER_CODE;

      if (dbValue == undefined) {
        dbValue = "000";
      }

      let USER_CODE = parseInt(dbValue, 10) + 1;

      USER_CODE += "";

      while (USER_CODE.length < 4) USER_CODE = "0" + USER_CODE;

      await db.query(
      `
      INSERT INTO USERS 
      (USER_CODE, PASSWORD, NAME, EMAIL) 
      VALUES 
      (?, ?, ?, ?)
      `, [USER_CODE, user.password, user.name, user.email]);

      res.status(201).send({ success: true, message: 'User correctly signed up' });
    } catch (err) {
      console.log(err);
      
      res.status(409).send({ success: false, message: `Email ${user.email} is already in use!` });
    }
  }
});



router.post('/authorize', Auth.authToken, async (req, res) => {

  const ACCESS_TOKEN = res.getHeader("ACCESS_TOKEN") ?? req.headers['authorization'].split(' ')[1];

  let dbUser = await db.query(
  `
  SELECT
  U.ID_USER as id,
  U.NAME as name,
  U.COLOR as userColor,
  U.EMAIL as email,
  TO_BASE64(U.PROFILE_PICTURE) as profilePicture
  FROM USERS U
  LEFT JOIN SESSIONS S ON S.ID_USER = U.ID_USER
  WHERE S.TOKEN = ?
  `, [ACCESS_TOKEN]);

  dbUser = dbUser[0];

  if (dbUser) {
    res.status(200).send({ success: true, data: dbUser });
  } else {
    res.status(401).send({ success: false, message: "Token not registered in your user!"});
  }
});



router.post('/logIn', async (req, res) => {

  const user = {
    email: req.body.email,
    password: req.body.password
  };


  try {

    let dbUser = await db.query(
    `
    SELECT
    U.ID_USER as id,
    U.NAME as name,
    U.COLOR as userColor,
    U.EMAIL as email,
    TO_BASE64(U.PROFILE_PICTURE) as profilePicture 
    FROM USERS U
    WHERE EMAIL = ? AND PASSWORD = ?
    `, [user.email, user.password]);

    dbUser = dbUser[0];

    if (dbUser) {

      res.set(await Auth.generateToken({
        _id: dbUser.id,
        userName: dbUser.userName 
      }));

      res.status(200).send({ success: true, data: {
        user: dbUser
      }});

    } else {
      res.status(400).send({ success: false, message: "User does not exist!" });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Database error!" });
  }
});



router.delete('/logout', Auth.authToken, async (req, res) => {

  const userID = res.locals._id;

  try {

    await db.query(
    `
    DELETE
    FROM SESSIONS
    WHERE ID_USER = ?
    `, [userID]);

    res.status(200).send({ success: true });

  } catch(err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Database error!" });
  }
  
});



router.post('/editProfile', [Auth.authToken, upload.single("image")], async (req, res) => {

  const file = req.file.buffer;

  const user = {};

  const userID = res.locals._id;

  try {

    await db.query(
    `
    UPDATE
    USERS
    SET
    PROFILE_PICTURE = ?
    WHERE ID_USER = ?
    `, [file, userID]);

    res.status(201).send({ 
      success: true,
      data: file.toString("base64")
    });

  } catch(err) {
    console.log(err);

    res.status(500).send({ success: false, message: "Database error!" });
  }
});



router.delete('/deleteProfile', Auth.authToken, async (req, res) => {

  try {
    
    const _id = res.locals._id;

    await db.query(
    `
    DELETE
    FROM USERS
    WHERE 
    ID_USER = ?
    `, [_id]);

    res.status(201).send({ 
      success: true,
    });

  } catch(err) {
    console.log(err);

    res.status(500).send({ success: false, message: "Database error!" });
  }
});



module.exports = router;