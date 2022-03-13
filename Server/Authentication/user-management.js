const express        = require('express');
const router         = express.Router();
const Auth           = require('./auth');
const REPTools       = require('../Tools/rep-tools');
const multer         = require('multer');
const upload         = multer({});
const REPQuery       = require('../Database/rep-query');
const REPEmail       = require('./rep-email');
const crypto         = require('crypto');
const { io }         = require('../start');
const model          = require('nanoid');
const { userSchema } = require('../Tools/schemas');
const clc            = require('cli-color');


router.post('/signUp', async (req, res) => {

  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const { error } = userSchema.validate(user);

  if (error)
    res.status(400).send({ success: false, message: 'Invalid fields!' });
  else {

    await REPTools.generateCode(user.name, "USERS", "USER_CODE", async (err, code) => {
      if (err) {
        return res.status(409).send({
          success: false,
          message: `Too many users are using the name "${user.name}". Try another name.`
        });
      } else {
        try {

          const hash = crypto.createHash('sha256').update(user.password).digest('hex');

          const dbUser = await REPQuery.one(
          `
          INSERT INTO USERS
              (USER_CODE, PASSWORD, NAME, EMAIL, BACKGROUND_COLOR)
          VALUES (?, ?, ?, ?, ?)
          RETURNING ID_USER as userID
          `, [code, hash, user.name, user.email, REPTools.randomHex()]);

          // SQL Trigger will take care of the rest

          const verification_code = model.nanoid(30);

          await REPQuery.exec(
          `
          INSERT INTO USERS_VERIFICATIONS
              (ID_USER, VERIFICATION_CODE)
          VALUES (?, ?)
          `, [dbUser.userID, verification_code]);

          const email = new REPEmail();

          email.sendMail(
            user.email,
            "RepubliChat email verification",
            `
            Welcome to RepubliChat! <br>
            This is your verification link, if you didn't know about this you can just ignore this email. <br>
            <a href="${process.env.ORIGIN}/verification/${verification_code}">Verify email here.</a>
            `
          );

          res.status(201).send({
            success: true,
            message: `User correctly signed up. Check your email and verify your account otherwise you won't be able to log in.`
          });
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



router.put('/verify/:verification_code', async (req, res) => {

  const verification_code = req.params.verification_code;

  try {

    const verificationRef = REPQuery.one(
    `
    SELECT ID_USER as userID
    FROM USERS_VERIFICATIONS
    WHERE VERIFICATION_CODE = ?
    `, [verification_code]);
  
    if (verificationRef) {

      REPQuery.exec(
      `
      UPDATE USERS
      SET VERIFIED = ?
      WHERE ID_USER = ?
      `, [true, verificationRef.userID]);

      res.status(201).send({
        success: true,
        message: `User verified, you can now log in.`
      });

    } else {
      res.status(400).send({ success: false, message: "Verification code invalid!" });
    }

  } catch(error) {
    console.log(error);

    res.status(500).send({ success: false, message: "Internal server error!" });
  }

});



router.post('/authorize', Auth.HTTPAuthToken, async (req, res) => {

  try {

    const _id = res.locals._id;

    const dbUser = await REPQuery.one(
    `
    SELECT U.ID_USER                    as id,
           U.USER_CODE                  as code,
           U.NAME                       as name,
           U.COLOR                      as color,
           U.BACKGROUND_COLOR           as backgroundColor,
           U.EMAIL                      as email,
           TO_BASE64(U.PROFILE_PICTURE) as picture
    FROM USERS U
    WHERE U.ID_USER = ?
    `, [_id]);

    if (dbUser) return res.status(200).send({ success: true, data: dbUser });

    res.status(401).send({ success: false, message: "There has been an error with the token authentication!"});
  } catch(err) {
    console.log(clc.red(err));
    res.status(500).send({ success: false, message: "Internal server error!" });
  }
});



router.post('/logIn', async (req, res) => {

  const user = {
    email: req.body.email,
    password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
  };

  const { BROWSER } = req.body;

  try {

    const dbUser = await REPQuery.one(
    `
    SELECT U.ID_USER                    as id,
           U.USER_CODE                  as code,
           U.NAME                       as name,
           U.COLOR                      as color,
           U.BACKGROUND_COLOR           as backgroundColor,
           U.EMAIL                      as email,
           TO_BASE64(U.PROFILE_PICTURE) as picture
    FROM USERS U
    WHERE EMAIL = ?
      AND PASSWORD = ?
    `, [user.email, user.password]);


    if (dbUser) {

      const sid = model.nanoid(process.env.SID_SIZE);

      await REPQuery.exec(
      `
      INSERT INTO SESSIONS
      (ID_USER, BROWSER_NAME, BROWSER_VERSION, LATITUDE, LONGITUDE, DATE, SID)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        dbUser.id,
        BROWSER.name,
        BROWSER.version,
        BROWSER.latitude,
        BROWSER.longitude,
        new Date(),
        sid
      ]);

      res.cookie("sid", sid, { maxAge: 31556952000 });

      // Session ID created only at login time
      res.status(200).send({ success: true, data: {
        user: dbUser
      }});

    } else {
      res.status(400).send({ success: false, message: "User does not exist!" });
    }
  }
  catch (err) {
    console.log(clc.red(err));
    res.status(500).send({ success: false, message: "Internal server error!" });
  }
});



router.delete('/logout', Auth.HTTPAuthToken, async (req, res) => {

  const userID     = res.locals._id;
  const sid        = res.locals.sid;

  try {
    await REPQuery.exec(
    `
    DELETE
    FROM SESSIONS
    WHERE ID_USER = ?
      AND SID = ?
    `, [userID, sid]);

    res.clearCookie("sid");
    res.status(200).send({ success: true });

  } catch(err) {
    console.log(clc.red(err));
    res.status(500).send({ success: false, message: "Internal server error!" });
  }
  
});



router.put('/editProfile', [Auth.HTTPAuthToken, upload.single("image")], async (req, res) => {

  const file = req.file.buffer;

  const user = {};

  const userID = res.locals._id;

  try {

    await REPQuery.exec(
    `
    UPDATE
        USERS
    SET PROFILE_PICTURE = ?
    WHERE ID_USER = ?
    `, [file, userID]);

    res.status(201).send({ 
      success: true,
      data: file.toString("base64")
    });

  } catch(err) {
    console.log(clc.red(err));

    res.status(500).send({ success: false, message: "Internal server error!" });
  }
});



router.delete('/deleteProfile', Auth.HTTPAuthToken, async (req, res) => {

  try {
    
    const _id = res.locals._id;

    res.clearCookie("sid");

    await REPQuery.exec(
    `
    DELETE
    FROM USERS
    WHERE ID_USER = ?
    `, [_id]);

    res.status(201).send({ 
      success: true,
    });

  } catch(err) {
    console.log(clc.red(err));

    res.status(500).send({ success: false, message: "Internal server error!" });
  }
});



router.get('/getDevices', Auth.HTTPAuthToken, async (req, res) => {

  const userID = res.locals._id;

  try {

    const devices = await REPQuery.load(
    `
    SELECT ID_SESSION      as id_session,
           BROWSER_NAME    as browserName,
           BROWSER_VERSION as browserVersion,
           DATE            as date,
           SID             as sid
    FROM SESSIONS
    WHERE ID_USER = ?
    `, [userID]);

    for (let device of devices) {
      if (device.sid == res.locals.sid) {
        device.current = true;
      }
      delete device.sid;
    }

    res.status(201).send({
      success: true,
      data: devices
    });

  } catch(err) {
    console.log(clc.red(err));

    res.status(500).send({ success: false, message: "Internal server error!" });
  }
});



router.delete('/disconnectDevice/:id', Auth.HTTPAuthToken, async (req, res) => {

  try {

    const _id      = req.params.id;
    const userID   = res.locals._id;

    const session = await REPQuery.one(
    `
    DELETE
    FROM SESSIONS
    WHERE ID_SESSION = ?
      AND ID_USER = ?
    RETURNING SID
    `, [_id, userID]);

    io.emit(session.SID, "forceKick");

    res.status(201).send({ 
      success: true,
    });

  } catch(err) {
    console.log(clc.red(err));

    res.status(500).send({ success: false, message: "Internal server error!" });
  }
});



router.get('/getSettings', Auth.HTTPAuthToken, async (req, res) => {

  const userID = res.locals._id;

  try {

    const settings = await REPQuery.one(
    `
    SELECT SHOW_CHANNELS     as showChannels,
           SHOW_SERVER_GROUP as showServerGroup,
           ANIMATIONS        as animations,
           DATE_FORMAT       as dateFormat
    FROM SETTINGS
    WHERE ID_USER = ?
    `, [userID]);

    REPTools.keysToBool(settings)

    res.status(201).send({
      success: true,
      data: settings
    });

  } catch(err) {
    console.log(clc.red(err));

    res.status(500).send({ success: false, message: "Internal server error!" });
  }
});


module.exports = router;