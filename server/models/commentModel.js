const con= require("./db_connect");

async function createCommentTable() {
    let sql = `
      CREATE TABLE IF NOT EXISTS comments (
        comment_id INT AUTO_INCREMENT,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        comment_content VARCHAR(280) NOT NULL,
        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT comment_pk PRIMARY KEY (comment_id),
        CONSTRAINT comment_post_fk FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
        CONSTRAINT comment_user_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        ); `

    await con.query(sql)
}

async function getCommentsByPostId(post_id) {
    let sql = `
        SELECT 
            comments.comment_id,
            comments.post_id,
            comments.user_id,
            comments.comment_content,
            comments.date_created,
            users.handle,
            users.first_name,
            users.last_name,
            profiles.profile_picture
        FROM comments
        JOIN users ON comments.user_id = users.user_id
        LEFT JOIN profiles ON users.user_id = profiles.user_id
        WHERE comments.post_id = ?
        ORDER BY comments.date_created ASC;
    `;

    return await con.query(sql, [post_id]);
}

async function createComment(comment) {
    let sql = `
      INSERT INTO comments (post_id, user_id, comment_content)
      VALUES (?, ?, ?);
    `

    await con.query(sql, [comment.post_id, comment.user_id, comment.comment_content])

    return await getCommentsByPostId(comment.post_id)
}

module.exports = {
    createCommentTable,
    getCommentsByPostId,
    createComment
};