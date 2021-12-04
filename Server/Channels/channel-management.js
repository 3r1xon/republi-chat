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
    
    await db.query(
    `
    INSERT INTO CHANNELS
    (NAME, PICTURE)
    VALUES
    (?, ?)
    `);

    res.status(201).send({ success: true });
  } catch (err) {
    console.log(err);
    
    res.status(500).send({ success: false, message: `Database error!` });
  }

});


module.exports = router;