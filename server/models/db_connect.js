require('dotenv').config();
const mysql = require('mysql2');

const con= mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

const query= (sql, binding) => {
    return new Promise((resolve, reject) => {
        con.query(sql, binding, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
};

module.exports = { query };