require('dotenv').config();
const mysql = require("mysql2");

const con = mysql.createConnection({
    host: process.env.MYSQL_HOST || process.env.MYSQLHOST,
    user: process.env.MYSQL_USER || process.env.MYSQLUSER,
    password: process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.MYSQL_DB || process.env.MYSQLDATABASE,
    port: process.env.MYSQL_PORT || process.env.MYSQLPORT || 3306
});

const query = (sql, binding) => {
    return new Promise((resolve, reject) => {
        con.query(sql, binding, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports = { query };