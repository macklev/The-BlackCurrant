const con = require("./db_connect")
const bcrypt = require("bcrypt")

async function createUserTable() {
    let sql = `
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        handle VARCHAR(255) NOT NULL UNIQUE,
        CONSTRAINT user_pk PRIMARY KEY (user_id)
        ); `

    await con.query(sql)
  }

async function getAllUsers() {
    let sql = `
      SELECT * FROM users;
    `
    return await con.query(sql)
}

async function register(user) {
  let cuser= await userExists(user)
  if(cuser) throw Error("User already exists")

  let hashedPassword = await bcrypt.hash(user.password, 10)
  let sql= `
    INSERT INTO users (first_name, last_name, email, password, handle)
    VALUES (?, ?, ?, ?, ?);
  `

    await con.query(sql, [user.first_name, user.last_name, user.email, hashedPassword, user.handle])

    return await userExists(user)
  }

  async function login(user) {
    let cuser= await userExists(user)
    if(!cuser) throw Error("User does not exist")

    let match = await bcrypt.compare(user.password, cuser.password)
    if(!match) throw Error("Incorrect password")

    return cuser
  }

  async function userExists(user) {
    let sql;
    let cuser;

    if (user.handle) {
        sql = `
          SELECT * FROM users WHERE email = ? OR handle = ?;
        `;
        cuser = await con.query(sql, [user.email, user.handle]);
    } else {
        sql = `
          SELECT * FROM users WHERE email = ?;
        `;
        cuser = await con.query(sql, [user.email]);
    }

    return cuser[0];
}

  async function updateUser(user_id, user) {
    let sql = `
      UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ?, handle = ? WHERE user_id = ?;
    `
    await con.query(sql, [user.first_name, user.last_name, user.email, user.password, user.handle, user_id])
  }

  async function deleteUser(user_id) {
    let sql = `
      DELETE FROM users WHERE user_id = ?;
    `
    await con.query(sql, [user_id])
  }

module.exports = { getAllUsers, register, updateUser, login, deleteUser }