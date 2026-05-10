const con = require("./db_connect")

async function createPostTable() {
    let sql = `
      CREATE TABLE IF NOT EXISTS posts (
        post_id INT AUTO_INCREMENT,
        user_id INT, 
        post_content VARCHAR(280) NOT NULL,
        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT post_pk PRIMARY KEY (post_id),
        CONSTRAINT post_user_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        ); `

    await con.query(sql)
}


async function getAllPosts() {
    let sql = `
      SELECT * FROM posts;
    `
    return await con.query(sql)
}

async function getPostsByUserId(user_id) {
    let sql = `
      SELECT * FROM posts WHERE user_id = ? ORDER BY date_created DESC;
    `
    return await con.query(sql, [user_id])
}

async function createPost(post) {
    let sql = `
      INSERT INTO posts (user_id, post_content)
      VALUES (?, ?);
    `

    await con.query(sql, [post.user_id, post.post_content])

    return await getPostsByUserId(post.user_id)
}

async function updatePost(post_id, post) {
    let sql = `
      UPDATE posts SET post_content = ? WHERE post_id = ?;
    `

    await con.query(sql, [post.post_content, post_id])

    return await getAllPosts()
}

async function deletePost(post_id) {
    let sql = `
      DELETE FROM posts WHERE post_id = ?;
    `

    await con.query(sql, [post_id])

    return await getAllPosts()
}

module.exports = { getAllPosts, createPost, createPostTable, updatePost, deletePost, getPostsByUserId}