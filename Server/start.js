const dotenv       = require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const app          = express();
const cookieParser = require('cookie-parser');
const port         = process.env.PORT;
const server       = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  exposedHeaders: ['sid'],
};


module.exports = {
  io: require('socket.io')(server, {
    cors: corsOptions
  })
};


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


