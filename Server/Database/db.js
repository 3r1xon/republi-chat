const mysql = require('mysql2');

module.exports = mysql.createConnection({
    host: 'republichat.cjxbyuj2mwfi.eu-central-1.rds.amazonaws.com',
    user: 'admin',
    password: 'rfAk4eYA9ykq',
    database: 'republichat'
});