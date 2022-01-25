const express        = require('express');
const cors           = require('cors');
const app            = express();
const port           = 3000;
const dotenv         = require('dotenv'); 
const cookieParser   = require('cookie-parser');
const Auth           = require('./Authentication/auth');
const server         = app.listen(port, () => { console.log(`Server listening at http://localhost:${port}`); });

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  exposedHeaders: ['sid'],
};

const io = require('socket.io')(server, {
  cors: corsOptions
});
io.use(Auth.WSAuthToken);
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


