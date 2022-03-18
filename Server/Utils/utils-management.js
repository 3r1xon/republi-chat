const express        = require('express');
const router         = express.Router();
const REPQuery       = require('../Database/rep-query');
const clc            = require('cli-color');


router.post('/sendReport', async (req, res) => {

    try {
      const { title, callstack } = req.body;

      await REPQuery.exec(
      `
      INSERT INTO REPORTS (TITLE, CALLSTACK)
      VALUES (?, ?)
      `, [title, callstack]);

      res.status(201).send({
        success: true,
      });

    } catch(err) {
      console.log(clc.red(err));

      res.status(500).send({ success: false, message: "Internal server error!" });
    }
});



module.exports = router;