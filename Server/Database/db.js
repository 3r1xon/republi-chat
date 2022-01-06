const mariadb = require('mariadb');

module.exports = mariadb.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'republichat'
});