const express        = require('express');
const cors           = require('cors');
const app            = express();
const port           = 3000;
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


app.use('/authentication', cors(corsOptions), require('./Authentication/user-management'));
app.use('/messages', cors(corsOptions), require('./Messages/message-management'));



app.get('/', (req, res) => {
  res.send('Server is working!');
});



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});