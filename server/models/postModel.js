const { getNextSequence } = require("./counterModel");
const { toPlain } = require("./plain");
const { User, Friend, Profile, Post } = require("./collections");
const cloudinary = require("../config/cloudinary");

async function getAllPosts() {
    const posts = await Post.find().sort({ date_created: -1 });
    return posts.map(toPlain);
}

async function getPostsByUserId(user_id) {
    const numericUserId = Number(user_id);
    const posts = await Post.find({ user_id: numericUserId }).sort({ date_created: -1 });
    return posts.map(toPlain);
}

async function getFeedPosts(user_id) {
    const numericUserId = Number(user_id);
    const friendships = await Friend.find({ user_id: numericUserId }).select("friend_id");
    const friendIds = friendships.map(friendship => friendship.friend_id);

    const posts = await Post.find({
        $or: [
            { user_id: numericUserId },
            { user_id: { $in: friendIds } }
        ]
    }).sort({ date_created: -1 });

    if (posts.length === 0) {
        return [];
    }

    const userIds = [...new Set(posts.map(post => post.user_id))];
    const users = await User.find({ user_id: { $in: userIds } }).select("-password");
    const profiles = await Profile.find({ user_id: { $in: userIds } });
    const userMap = new Map(users.map(user => [user.user_id, toPlain(user)]));
    const profileMap = new Map(profiles.map(profile => [profile.user_id, toPlain(profile)]));

    return posts.map(post => {
        const postData = toPlain(post);
        const user = userMap.get(post.user_id) || {};
        const profile = profileMap.get(post.user_id) || {};

        return {
            ...postData,
            handle: user.handle,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_picture: profile.profile_picture,
            profile_bio: profile.profile_bio
        };
    });
}

async function createPost(post) {
    const numericUserId = Number(post.user_id);
    const post_id = await getNextSequence("posts");

    const media = post.media || [];

    await Post.create({
        post_id,
        user_id: numericUserId,
        post_content: post.post_content,
        media: media
    });

    return await getPostsByUserId(numericUserId);
}

async function updatePost(post_id, post) {
    await Post.findOneAndUpdate(
        { post_id: Number(post_id) },
        { post_content: post.post_content },
        { new: true }
    );

    return await getAllPosts();
}

async function deletePost(post_id) {

    const post = await Post.findOne({
        post_id: Number(post_id)
    });


    if (!post) {
        throw new Error("Post not found");
    }


    //delete from cloudinary
    if (post.media && post.media.length > 0) {

        for (const media of post.media) {

            if (media.filePath) {

                // Extract public_id from Cloudinary URL
                const parts = media.filePath.split("/");

                const fileName = parts[parts.length - 1]
                    .split(".")[0];

                const folder = parts[parts.length - 2];


                const publicId = `${folder}/${fileName}`;


                await cloudinary.uploader.destroy(
                    publicId,
                    {
                        resource_type:
                            media.fileType === "video"
                                ? "video"
                                : "image"
                    }
                );

            }
        }
    }


    await Post.deleteOne({
        post_id: Number(post_id)
    });


    return await getAllPosts();
}

module.exports = { getAllPosts, createPost, updatePost, deletePost, getPostsByUserId, getFeedPosts };
