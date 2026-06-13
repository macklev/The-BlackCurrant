const { getNextSequence } = require("./counterModel");
const { toPlain } = require("./plain");
const { User, Profile, Friend } = require("./collections");

async function createFriendship(user_id, friend_id) {
    const numericUserId = Number(user_id);
    const numericFriendId = Number(friend_id);
    const existingFriendship = await Friend.findOne({
        user_id: numericUserId,
        friend_id: numericFriendId
    });

    if (existingFriendship) {
        return existingFriendship;
    }

    const friendship_id = await getNextSequence("friendships");

    return await Friend.create({
        friendship_id,
        user_id: numericUserId,
        friend_id: numericFriendId
    });
}

async function addFriend(user_id, friend_id) {
    if (Number(user_id) === Number(friend_id)) {
        throw new Error("You cannot add yourself as a friend.");
    }

    await Promise.all([
        createFriendship(user_id, friend_id),
        createFriendship(friend_id, user_id)
    ]);

    return await getFriends(user_id);
}

async function getFriends(user_id) {
    const numericUserId = Number(user_id);
    const friendships = await Friend.find({ user_id: numericUserId }).sort({ friend_id: 1 });
    const friendIds = friendships.map(friendship => friendship.friend_id);

    if (friendIds.length === 0) {
        return [];
    }

    const users = await User.find({ user_id: { $in: friendIds } }).select("-password");
    const profiles = await Profile.find({ user_id: { $in: friendIds } });
    const userMap = new Map(users.map(user => [user.user_id, toPlain(user)]));
    const profileMap = new Map(profiles.map(profile => [profile.user_id, toPlain(profile)]));

    return friendIds
        .map(friendId => {
            const user = userMap.get(friendId);
            if (!user) return null;

            const profile = profileMap.get(friendId) || {};
            return {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                handle: user.handle,
                profile_picture: profile.profile_picture,
                profile_bio: profile.profile_bio
            };
        })
        .filter(Boolean)
        .sort((left, right) => left.handle.localeCompare(right.handle));
}

async function removeFriend(user_id, friend_id) {
    const numericUserId = Number(user_id);
    const numericFriendId = Number(friend_id);

    await Friend.deleteMany({
        $or: [
            { user_id: numericUserId, friend_id: numericFriendId },
            { user_id: numericFriendId, friend_id: numericUserId }
        ]
    });

    return await getFriends(numericUserId);
}

module.exports = {
    addFriend,
    getFriends,
    removeFriend
};
