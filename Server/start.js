const express        = require('express');
const cors           = require('cors');
const app            = express();
const port           = 3000;
const dotenv         = require('dotenv'); 
const jwt            = require('jsonwebtoken');
const cookieParser   = require('cookie-parser');
const server         = app.listen(port, () => { console.log(`Server listening at http://localhost:${port}`); });

const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
  exposedHeaders: ['ACCESS_TOKEN', 'REFRESH_TOKEN', 'SESSION_ID'],
};

const io = require('socket.io')(server, {
  cors: corsOptions
});
module.exports = io;



dotenv.config();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());



// Get the exact time of the request, available for every request.
app.use((req, res, next) => { 
  res.locals._requestDate = new Date(parseInt(req.headers['requestdate']));
  next(); 
});



app.use('/authentication', require('./Authentication/user-management'));
app.use('/messages', require('./Messages/message-management'));
app.use('/channels', require('./Channels/channel-management'));



app.get('/', (req, res) => {
  res.send('Server is working!');
});



io.use((socket, next) => {
  next();
  // const { ACCESS_TOKEN } = socket.handshake.query;
  // console.log(ACCESS_TOKEN);
  // jwt.verify(ACCESS_TOKEN, process.env.SECRET_KEY, async (err, decoded) => {
  //   if (decoded) {
  //     console.log("DECODED");
  //     next();
  //   } else {
  //     console.error("FAILED");
  //     next();
  //   }
  // });
});