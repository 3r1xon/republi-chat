const express        = require('express');
const cors           = require('cors');
const db             = require('./db');
const app            = express();
const port           = 3000;
const fm             = require('date-fns');
const Auth           = require('./auth');
const dotenv         = require('dotenv'); 
const cookieParser   = require("cookie-parser");


const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
  exposedHeaders: ['ACCESS_TOKEN', 'REFRESH_TOKEN'],
};
dotenv.config();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());



app.get('/', (req, res) => {
  res.send('Server is working!');
});



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});



app.post('/sendMessage', Auth.authToken, async (req, res) => {
  
  const msg = {
    id_user: req.body.id,
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

    res.send({ success: true, data: id });
  } catch (err) {
    console.log(err);
    
    res.send({ success: false, message: `Database error!` });
  }
});



app.get('/getMessages', Auth.authToken, async (req, res) => {

  try {

    let messages = await db.promise().query(
    `
    SELECT
    M.ID_MESSAGE as id,
    U.COLOR as userColor,
    U.NICKNAME as userName,
    U.PROFILE_PICTURE as userImage,
    M.MESSAGE as userMessage,
    M.DATE as date
    FROM MESSAGES M
    LEFT JOIN USERS U ON U.ID_USER = M.ID_USER
    `);

    messages = messages[0];
  
    res.send({ success: true, data: messages});
  } catch (err) {

    console.log(err);

    res.send({ success: false, message: "Database error!" });
  }

});



app.post('/signUp', async (req, res) => {
  
  const user = {
    userName: req.body.userName,
    password: req.body.password
  };

  if (user.userName == '' || user.password == '')
    res.send({ success: false, message: 'Username or password invalid' });
  else {
    try {

      await db.promise().query(
      `
      INSERT INTO USERS 
      (NICKNAME, PASSWORD, COLOR, PROFILE_PICTURE) 
      VALUES 
      (?, ?, '#FFFFFF', '/assets/user-image.png')
      `, [user.userName, user.password]);

      res.send({ success: true, message: 'User correctly signed up' });
    } catch (err) {
      console.log(err);
      
      res.send({ success: false, message: `Nickname ${user.userName} already exist!` });
    }
  }
});



app.post('/logIn', async (req, res) => {

  const user = {
    userName: req.body.userName,
    password: req.body.password
  };


  try {

    let dbUser = await db.promise().query(
    `
    SELECT
    ID_USER as id,
    NICKNAME as userName,
    NAME as name,
    COLOR as userColor,
    PROFILE_PICTURE as profilePicture 
    FROM USERS 
    WHERE NICKNAME = ? AND PASSWORD = ?
    `, [user.userName, user.password]);

    dbUser = dbUser[0][0];

    if (dbUser) {

      res.set(await Auth.generateToken({
        id: dbUser.ID_USER,
        userName: dbUser.NICKNAME 
      }));

      res.send({ success: true, data: {
        user: dbUser
      }});
  
    } else {
      res.send({ success: false, message: "User does not exist!" });
    }
  }
  catch (err) {
    console.log(err);
    res.send({ success: false, message: "Database error!" });
  }
});



app.post('/editProfile', Auth.authToken, async (req, res) => {

  await db.promise().query(
    `
    UPDATE
    USERS
    SET
    NAME = '',
    COLOR = '',
    PROFILE_PICTURE = ''
    WHERE ID_USER = {}
    `
  );
  
});



app.post('/authorize', async (req, res) => {

  const { REFRESH_TOKEN } = req.cookies;

  let id_user = await db.promise().query(
  `
  SELECT 
  ID_USER 
  FROM SESSIONS 
  WHERE REFRESH_TOKEN = ?
  `, [REFRESH_TOKEN]);

  id_user = id_user[0][0];

  if (id_user) {

    let dbUser = await db.promise().query(
    `
    SELECT
    ID_USER as id,
    NICKNAME as userName,
    NAME as name
    FROM USERS
    WHERE ID_USER = ?
    `, [id_user.ID_USER]);

    dbUser = dbUser[0][0];

    res.set(await Auth.generateToken({
      id: dbUser.id, 
      userName: dbUser.userName 
    }));

    res.send({ success: true, data: dbUser });

  } else {
    res.send({ success: false, message: "Token invalid!"});
  }
});



app.post('/deleteMessage', Auth.authToken, async (req, res) => {

  try {
    const id_message = req.body.id_message;

    await db.promise().query(
    `
    DELETE FROM MESSAGES 
    WHERE ID_MESSAGE = ?
    `, [id_message]);

    res.send({ success: true });
  } catch (err) {
    console.log(err);

    res.send({ success: false, message: "Database error!" });
  }

});