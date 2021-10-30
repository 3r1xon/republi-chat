const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const port = 3000;
const fm = require('date-fns');

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Server is working!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.post('/sendMessage', async (req, res) => {

  console.log(req.body.date);

  const msg = {
    id_user: req.body.id,
    userMessage: req.body.userMessage,
    date: req.body.date
  };

  try {
    await db.promise().query(`INSERT INTO MESSAGES (ID_USER, MESSAGE, DATE) VALUES (${msg.id_user}, '${msg.userMessage}', '${msg.date}')`);

    let id = await db.promise().query(`SELECT LAST_VALUE(ID_MESSAGE) AS ID_MESSAGE
    FROM MESSAGES 
    WHERE ID_USER = ${msg.id_user} 
    ORDER BY ID_MESSAGE DESC`);

    id = id[0][0].ID_MESSAGE;

    res.status(201).send({ success: true, data: id });
  } catch (err) {
    console.log(err);
    
    res.status(400).send({ success: false, message: `Database error!` });
  }
});

app.post('/getMessages', async (req, res) => {

  try {

    let messages = await db.promise().query(`SELECT
    M.ID_MESSAGE,
    M.ID_USER,
    U.NICKNAME,
    M.MESSAGE,
    M.DATE 
    FROM MESSAGES M
    LEFT JOIN USERS U ON U.ID_USER = M.ID_USER`);

    messages = messages[0];
  
    res.status(201).send({ success: true, data: messages });
  } catch (err) {

    console.log(err);

    res.status(400).send({ success: false, message: "Database error!" });
  }

});

app.post('/signUp', (req, res) => {
  
  const user = {
    userName: req.body.userName,
    password: req.body.password
  };

  if (user.userName == '' || user.password == '')
    res.status(400).send({ success: false, message: 'Username or password invalid' });
  else {
    try {
      db.promise().query(`INSERT INTO USERS (NICKNAME, PASSWORD) VALUES ('${user.userName}', '${user.password}')`);

      res.status(201).send({ success: true, message: 'User correctly signed up' });
    } catch (err) {
      console.log(err);
      
      res.status(400).send({ success: false, message: `Nickname ${user.userName} already exist!` });
    }
  }
});

app.post('/logIn', async (req, res) => {

  const user = {
    userName: req.body.userName,
    password: req.body.password
  };

  try {

    let dbUser = await db.promise().query(`SELECT * FROM USERS WHERE NICKNAME = '${user.userName}' AND PASSWORD = '${user.password}'`);
    dbUser = dbUser[0][0];

    console.log(dbUser);
  
    if (dbUser.NICKNAME == user.userName && dbUser.PASSWORD == user.password) {

      res.status(200).send({ success: true, data: {
        id: dbUser.ID_USER,
        userName: dbUser.NICKNAME,
        name: dbUser.NAME
      }});
  
    } else {
      res.status(400).send({ success: false, message: "User does not exist!" });
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).send({ success: false, message: "Database error!" });
  }
});