const express        = require('express');
const cors           = require('cors');
const app            = express();
const port           = 3000;
const dotenv         = require('dotenv'); 
const cookieParser   = require('cookie-parser');
const server         = app.listen(port, () => { console.log(`Server listening at http://localhost:${port}`); });

const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
  exposedHeaders: ['ACCESS_TOKEN', 'REFRESH_TOKEN'],
};

const io             = require('socket.io')(server, {
  cors: corsOptions
});

module.exports = io;


dotenv.config();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.use('/authentication', require('./Authentication/user-management'));
app.use('/messages', require('./Messages/message-management'));
app.use('/channels', require('./Channels/channel-management'));



app.get('/', (req, res) => {
  res.send('Server is working!');
});



io.on('connection', (socket) => {
  console.log('Connection established with new user');
});
