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

          // SQL Triggers will take care of the rest

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
            <div class="master" style="margin: 0;padding: 0;color: white;justify-content: center;align-items: center;font-family: roboto;">

                <div class="header" style="margin: 0;padding: 0;width: 100%;height: 150px;background: #46a35e;line-height: 150px;text-align: center;border-top-left-radius: 5px;border-top-right-radius: 5px;">
                  <h1 style="margin: 0;padding: 0;">Welcome to RepubliChat! 😉</h1>
                </div>

                <div class="content" style="margin: 0;padding: 0;width: 100%;height: 250px;background: #202124;display: grid;place-items: center;text-align: center;line-height: 2.5rem;">
                  <p style="margin: 0;padding: 0;">
                  Hi ${user.name}, thank you for registering to RepubliChat! ❤️
                  <br style="margin: 0;padding: 0;">
                  We are glad to have you as a new user, please quickly confirm your email by simply clicking the button below.
                  </p>

                  <div class="center" style="margin: auto;padding: 0;width: 50%;text-align: center;">
                    <a class="btn" href="${process.env.ORIGIN}/verification/${verification_code}" style="margin: 0;padding: 0;color: white;text-decoration: none;width: 150px;height: 50px;border-radius: 5px;display: inline-block;line-height: 50px;font-size: 18px;border: none;background: royalblue;">
                      Confirm email
                    </a>
                  </div>

                  <p style="margin: 0;padding: 0;">If you did not register anywhere just ignore this email.</p>

                </div>

                <div class="footer" style="margin: 0;padding: 0;width: 100%;height: 100px;background: #121212;line-height: 100px;text-align: center;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;">

                    <a href="${process.env.ORIGIN}" style="margin: 0;padding: 0;color: hotpink;text-decoration: none;">RepubliChat</a>

                </div>

            </div>
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

  try {

    const verification_code = req.params.verification_code;

    const verificationRef = await REPQuery.one(
    `
    SELECT ID_USER_VERIFICATION as verificationID,
           ID_USER              as userID
    FROM USERS_VERIFICATIONS
    WHERE VERIFICATION_CODE = ?
    `, [verification_code]);

    if (verificationRef) {

      await REPQuery.exec(
      `
      UPDATE USERS
      SET VERIFIED = ?
      WHERE ID_USER = ?
      `, [true, verificationRef.userID]);

      await REPQuery.exec(
      `
      DELETE
      FROM USERS_VERIFICATIONS
      WHERE ID_USER_VERIFICATION = ?
      `, [verificationRef.verificationID]);

      res.status(201).send({
        success: true,
        message: `User verified, you can now log in.`
      });

    } else {
      res.status(400).send({ success: false, message: "Verification code is invalid!" });
    }

  } catch(error) {
    console.log(clc.red(error));

    res.status(500).send({ success: false, message: "Internal server error!" });
  }

});



router.post('/authorize', Auth.HTTPAuthToken, async (req, res) => {

  try {

    const userID = res.locals._id;

    const dbUser = await REPQuery.one(
    `
    SELECT U.ID_USER                    as id,
           U.USER_CODE                  as code,
           U.NAME                       as name,
           U.COLOR                      as color,
           U.BACKGROUND_COLOR           as backgroundColor,
           U.EMAIL                      as email,
           TO_BASE64(U.PROFILE_PICTURE) as picture,
           U.LAST_JOINED_CHANNEL        as lastJoinedChannel,
           U.LAST_JOINED_ROOM           as lastJoinedRoom
    FROM USERS U
    WHERE U.ID_USER = ?
      AND U.DELETED IS NOT TRUE
    `, [userID]);

    if (dbUser) return res.status(200).send({ success: true, data: dbUser });

    res.status(401).send({ success: false, message: "There has been an error with the token authentication!"});
  } catch(err) {
    console.log(clc.red(err));
    res.status(500).send({ success: false, message: "Internal server error!" });
  }
});



router.post('/logIn', async (req, res) => {

  try {

    const user = {
      email: req.body.email,
      password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
    };

    const { BROWSER } = req.body;

    const dbUser = await REPQuery.one(
    `
    SELECT U.ID_USER                    as id,
           U.USER_CODE                  as code,
           U.NAME                       as name,
           U.COLOR                      as color,
           U.BACKGROUND_COLOR           as backgroundColor,
           U.EMAIL                      as email,
           TO_BASE64(U.PROFILE_PICTURE) as picture,
           U.VERIFIED                   as verified,
           U.LAST_JOINED_CHANNEL        as lastJoinedChannel,
           U.LAST_JOINED_ROOM           as lastJoinedRoom
    FROM USERS U
    WHERE U.EMAIL = ?
      AND U.PASSWORD = ?
      AND U.DELETED IS NOT TRUE
    `, [user.email, user.password]);

    if (dbUser) {

      if (!dbUser.verified) {

        res.status(400).send({
          success: false,
          message: "User is not verified, please check your email and verify your account!"
        });

        return;
      }

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

  try {

    const userID     = res.locals._id;
    const sid        = res.locals.sid;

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



router.put('/editProfile', [Auth.HTTPAuthToken, /*upload.single("image")*/], async (req, res) => {

  try {

    // const file = req.file.buffer;

    const user = req.body;

    const { error } = userSchema.validate(user);

    if (error) {
      return res.status(400).send({ success: false, message: 'Invalid fields!' });
    }

    const equivalentFields = {
      name: "NAME",
      email: "EMAIL",
      picture: "PROFILE_PICTURE",
      code: "USER_CODE"
    };

    const userID = res.locals._id;

    if (user.name != undefined) {
      await REPTools.generateCode(user.name, "USERS", "USER_CODE", async (err, code) => {
        if (err) {
          return res.status(409).send({
            success: false,
            message: `Too many users are using the name "${user.name}". Try another name.`
          });
        } else {
          user.code = code;
        }
      });
    }

    const managedSQL = REPQuery.manageUpdateSQL("USERS", equivalentFields, user);

    const SQL_UPDATE =
    `
    ${managedSQL.SQL}
    WHERE ID_USER = ?
    `;

    managedSQL.orderedValues.push(userID);

    await REPQuery.exec(SQL_UPDATE, managedSQL.orderedValues);

    res.status(201).send({
      success: true,
      data: user
      // data: file.toString("base64")
    });

  } catch(err) {
    console.log(clc.red(err));

    res.status(500).send({ success: false, message: "Internal server error!" });
  }
});



router.delete('/deleteProfile', Auth.HTTPAuthToken, async (req, res) => {

  try {

    const userID = res.locals._id;

    res.clearCookie("sid");

    const rand = model.nanoid(30);

    await REPQuery.exec(
    `
    UPDATE USERS
    SET USER_CODE           = ?,
        EMAIL               = ?,
        PASSWORD            = ?,
        NAME                = ?,
        PROFILE_PICTURE     = ?,
        BIOGRAPHY           = ?,
        VERIFIED            = ?,
        LAST_JOINED_CHANNEL = ?,
        LAST_JOINED_ROOM    = ?,
        DELETED = ?
    WHERE ID_USER = ?
    `, [
      "****",
      `Deleted ${rand}`,
      rand,
      `Deleted user ${model.nanoid(10)}`,
      null,
      null,
      false,
      null,
      null,
      true,
      userID
    ]);

    await REPQuery.exec(
    `
    DELETE FROM SESSIONS
    WHERE ID_USER = ?
    `, [userID]);

    res.status(201).send({
      success: true
    });

  } catch(err) {
    console.log(clc.red(err));

    res.status(500).send({ success: false, message: "Internal server error!" });
  }
});



router.get('/getDevices', Auth.HTTPAuthToken, async (req, res) => {

  try {
    const userID = res.locals._id;

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

  try {
    const userID = res.locals._id;

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