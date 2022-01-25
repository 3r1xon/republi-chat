const mariadb = require('mariadb');
const dotenv  = require('dotenv'); 
dotenv.config();

module.exports = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});