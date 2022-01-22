const express        = require('express');
const router         = express.Router();
const Auth           = require('./auth');
const REPTools       = require('../Tools/rep-tools');
const multer         = require('multer');
const upload         = multer({});
const db             = require('../Database/db');
const crypto         = require('crypto');
const io             = require('../start');



router.post('/signUp', async (req, res) => {
  
  const user = {
    email: req.body.email,
    password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
    name: req.body.name,
  };

  if (user.email == '' || user.password == '' || user.name == '')
    res.status(400).send({ success: false, message: 'Email or password invalid' });
  else {

    await REPTools.generateCode(user.name, "USERS", "USER_CODE", async (err, code) => {
      if (err) {
        return res.status(409).send({
          success: false,
          message: `Too many users are using the name "${user.name}". Try another name.`
        });
      } else {
        try {

          await db.query(
          `
          INSERT INTO USERS 
          (USER_CODE, PASSWORD, NAME, EMAIL)
          VALUES 
          (?, ?, ?, ?)
          `, [code, user.password, user.name, user.email]);

          res.status(201).send({ success: true, message: 'User correctly signed up' });
        } catch(error) {

          console.log(error);

          if (error.code == "ER_DUP_ENTRY")
            res.status(409).send({ success: false, message: `Email ${user.email} is already in use!` });
          else
            res.status(500).send({ success: false, message: "Internal server error!" });
        }
      }
    });
  }
});



router.post('/authorize', Auth.authToken, async (req, res) => {

  try {

    const _id = res.locals._id;

    let dbUser = await db.query(
    `
    SELECT
    U.ID_USER as id,
    U.USER_CODE as code,
    U.NAME as name,
    U.COLOR as color,
    U.EMAIL as email,
    TO_BASE64(U.PROFILE_PICTURE) as picture
    FROM USERS U
    WHERE U.ID_USER = ?
    `, [_id]);

    dbUser = dbUser[0];

    if (dbUser) return res.status(200).send({ success: true, data: dbUser });

    res.status(401).send({ success: false, message: "There has been an error with the token authentication!"});
  } catch(err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Internal server error!" });
  }
});



router.post('/logIn', async (req, res) => {

  const user = {
    email: req.body.email,
    password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
  };

  console.log(req.session.id);

  const { BROWSER } = req.body;

  try {

    let dbUser = await db.query(
    `
    SELECT
    U.ID_USER as id,
    U.USER_CODE as code,
    U.NAME as name,
    U.COLOR as color,
    U.EMAIL as email,
    TO_BASE64(U.PROFILE_PICTURE) as picture 
    FROM USERS U
    WHERE EMAIL = ? AND PASSWORD = ?
    `, [user.email, user.password]);

    dbUser = dbUser[0];

    if (dbUser) {

      const SESSION_ID = req.session.id;

      await db.query(
      `
      INSERT INTO SESSIONS
      (ID_USER, BROWSER_NAME, BROWSER_VERSION, LATITUDE, LONGITUDE, DATE, SESSION_ID)
      VALUES
      (?, ?, ?, ?, ?, ?, ?)
      `, [
        dbUser.id,
        BROWSER.name,
        BROWSER.version,
        BROWSER.latitude,
        BROWSER.longitude,
        new Date(),
        SESSION_ID
      ]);

      const oneYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

      res.cookie("SESSION_ID", SESSION_ID, { expires: oneYear, httpOnly: true });

      // Session ID created only at login time
      res.status(200).send({ success: true, data: {
        user: dbUser
      }});

    } else {
      res.status(400).send({ success: false, message: "User does not exist!" });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Internal server error!" });
  }
});



router.delete('/logout', Auth.authToken, async (req, res) => {

  const userID     = res.locals._id;
  const SESSION_ID = res.locals.SESSION_ID;

  res.clearCookie("SESSION_ID");

  try {

    await db.query(
    `
    DELETE
    FROM SESSIONS
    WHERE ID_USER = ?
    AND SESSION_ID = ?
    `, [userID, SESSION_ID]);

    res.status(200).send({ success: true });

  } catch(err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Internal server error!" });
  }
  
});



router.put('/editProfile', [Auth.authToken, upload.single("image")], async (req, res) => {

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

    res.status(500).send({ success: false, message: "Internal server error!" });
  }
});



router.delete('/deleteProfile', Auth.authToken, async (req, res) => {

  try {
    
    const _id = res.locals._id;

    res.clearCookie("SESSION_ID");

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

    res.status(500).send({ success: false, message: "Internal server error!" });
  }
});



router.get('/getDevices', Auth.authToken, async (req, res) => {

  const userID = res.locals._id;

  try {

    const devices = await db.query(
    `
    SELECT 
    ID_SESSION as id_session,
    BROWSER_NAME as browserName,
    BROWSER_VERSION as browserVersion,
    DATE as date,
    SESSION_ID
    FROM SESSIONS
    WHERE ID_USER = ?
    `, [userID]);

    devices.map((device) => {
      if (device.SESSION_ID == res.locals.SESSION_ID) {
        device.current = true;
      } else {
        device.current = false;
      }
      delete device.SESSION_ID;
    });

    res.status(201).send({
      success: true,
      data: devices
    });

  } catch(err) {
    console.log(err);

    res.status(500).send({ success: false, message: "Internal server error!" });
  }
});



router.delete('/disconnectDevice/:id', Auth.authToken, async (req, res) => {

  try {
    
    const _id    = req.params.id;
    const userID = res.locals._id;

    let session = await db.query(
    `
    DELETE
    FROM SESSIONS
    WHERE 
    ID_SESSION = ?
    AND ID_USER = ?
    RETURNING SESSION_ID
    `, [_id, userID]);
    
    session = session[0];

    io.emit(session.SESSION_ID, "forceKick");

    res.status(201).send({ 
      success: true,
    });

  } catch(err) {
    console.log(err);

    res.status(500).send({ success: false, message: "Internal server error!" });
  }
});


module.exports = router;