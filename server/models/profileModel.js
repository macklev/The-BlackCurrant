const con = require("./db_connect");

async function getProfileByUserId(user_id) {
    let sql = `
        SELECT 
            profiles.profile_id,
            profiles.profile_picture,
            profiles.profile_bio,
            profiles.user_id,
            users.first_name,
            users.last_name,
            users.handle
        FROM users
        LEFT JOIN profiles ON users.user_id = profiles.user_id
        WHERE users.user_id = ?;
    `;

    const result = await con.query(sql, [user_id]);
    return result[0];
}

async function createOrUpdateProfile(profile) {
    let existingProfile = await getProfileByUserId(profile.user_id);

    if (existingProfile && existingProfile.profile_id) {
        let sql = `
            UPDATE profiles
            SET profile_picture = ?, profile_bio = ?
            WHERE user_id = ?;
        `;

        await con.query(sql, [
            profile.profile_picture,
            profile.profile_bio,
            profile.user_id
        ]);
    } else {
        let sql = `
            INSERT INTO profiles (profile_picture, profile_bio, user_id)
            VALUES (?, ?, ?);
        `;

        await con.query(sql, [
            profile.profile_picture,
            profile.profile_bio,
            profile.user_id
        ]);
    }

    return await getProfileByUserId(profile.user_id);
}

module.exports = {
    getProfileByUserId,
    createOrUpdateProfile
};