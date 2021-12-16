const express        = require('express');
const router         = express.Router();
const Auth           = require('./auth');
const REPTools       = require('../Tools/rep-tools');
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
            res.status(500).send({ success: false, message: "Database error!" });
        }
      }
    });
  }
});



router.post('/authorize', Auth.authToken, async (req, res) => {

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

      res.set(await Auth.generateToken({
        _id: dbUser.id,
        email: dbUser.email 
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


// TODO: Should be changed to PUT.
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