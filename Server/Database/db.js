const mariadb = require('mariadb');

module.exports = mariadb.createPool({
    host: 'republi-chat.cjxbyuj2mwfi.eu-central-1.rds.amazonaws.com',
    user: 'admin',
    password: 'rfAk4eYA9ykq',
    database: 'republichat'
});