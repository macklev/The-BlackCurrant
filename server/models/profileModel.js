const { getNextSequence } = require("./counterModel");
const { toPlain } = require("./plain");
const { Profile, User } = require("./collections");

async function getProfileByUserId(user_id) {
    const numericUserId = Number(user_id);
    const profile = await Profile.findOne({ user_id: numericUserId });
    const user = await User.findOne({ user_id: numericUserId }).select("-password");

    if (!user) return null;

    const profileData = toPlain(profile) || {};
    const userData = toPlain(user);

    return {
        ...profileData,
        user_id: userData.user_id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        handle: userData.handle
    };
}

async function createOrUpdateProfile(profile) {
    const numericUserId = Number(profile.user_id);
    const existingProfile = await Profile.findOne({ user_id: numericUserId });

    if (existingProfile) {
        await Profile.findOneAndUpdate(
            { user_id: numericUserId },
            {
                profile_picture: profile.profile_picture,
                profile_bio: profile.profile_bio
            },
            { new: true }
        );
    } else {
        const profile_id = await getNextSequence("profiles");

        await Profile.create({
            profile_id,
            profile_picture: profile.profile_picture,
            profile_bio: profile.profile_bio,
            user_id: numericUserId
        });
    }

    return await getProfileByUserId(numericUserId);
}

module.exports = {
    getProfileByUserId,
    createOrUpdateProfile
};
