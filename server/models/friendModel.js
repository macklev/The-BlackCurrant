const con = require("./db_connect");

async function addFriend(user_id, friend_id) {
    if (Number(user_id) === Number(friend_id)) {
        throw new Error("You cannot add yourself as a friend.");
    }

    let sql = `
        INSERT IGNORE INTO friends (user_id, friend_id)
        VALUES (?, ?), (?, ?);
    `;

    await con.query(sql, [user_id, friend_id, friend_id, user_id]);

    return await getFriends(user_id);
}

async function getFriends(user_id) {
    let sql = `
        SELECT 
            users.user_id,
            users.first_name,
            users.last_name,
            users.handle,
            profiles.profile_picture,
            profiles.profile_bio
        FROM friends
        JOIN users ON friends.friend_id = users.user_id
        LEFT JOIN profiles ON users.user_id = profiles.user_id
        WHERE friends.user_id = ?
        ORDER BY users.handle;
    `;

    return await con.query(sql, [user_id]);
}

async function removeFriend(user_id, friend_id) {
    let sql = `
        DELETE FROM friends
        WHERE (user_id = ? AND friend_id = ?)
           OR (user_id = ? AND friend_id = ?);
    `;

    await con.query(sql, [user_id, friend_id, friend_id, user_id]);

    return await getFriends(user_id);
}

module.exports = {
    addFriend,
    getFriends,
    removeFriend
};