require('dotenv')
  .config(process.env.NODE_ENV == 'production' ? { path: '.env.prod' } : null);

const https        = require('https');
const fs           = require('fs');
const express      = require('express');
const cors         = require('cors');
const app          = express();
const cookieParser = require('cookie-parser');
const Auth         = require('./Authentication/auth');
const port         = process.env.PORT;



const server = (() => {

  if (process.env.NODE_ENV) {

    const httpsOptions = {
      key: fs.readFileSync(process.env.CERT_KEY_PATH),
      cert: fs.readFileSync(process.env.CERT_PATH),
      requestCert: false,
      rejectUnauthorized: false
    };

    return https.createServer(httpsOptions, app).listen(port, () =>
      console.log(`Server listening at http://localhost:${port}`));
  }

  return app.listen(port, () =>
    console.log(`Server listening at http://localhost:${port}`));

})();

const corsOptions = {
  origin: process.env.ORIGIN,
  credentials: true,
  exposedHeaders: ['sid'],
};

const io = require('socket.io')(server, {
  cors: corsOptions
});

io.use(Auth.WSAuthToken);

module.exports = {
  io: io
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());



app.use('/authentication', require('./Authentication/user-management'));
app.use('/messages', require('./Messages/message-management'));
app.use('/channels', require('./Channels/channel-management'));
app.use('/utils', require('./Utils/utils-management'));

app.use('/sockets', require('./Sockets/sockets-management'));



app.get('/', (req, res) => {
  res.send('Server is working!');
});


