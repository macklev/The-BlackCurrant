const { getNextSequence } = require("./counterModel");
const { toPlain } = require("./plain");
const { User, Profile, Comment } = require("./collections");

async function getCommentsByPostId(post_id) {
    const numericPostId = Number(post_id);
    const comments = await Comment.find({ post_id: numericPostId }).sort({ date_created: 1 });
    const userIds = [...new Set(comments.map(comment => comment.user_id))];

    if (userIds.length === 0) {
        return [];
    }

    const users = await User.find({ user_id: { $in: userIds } }).select("-password");
    const profiles = await Profile.find({ user_id: { $in: userIds } });
    const userMap = new Map(users.map(user => [user.user_id, toPlain(user)]));
    const profileMap = new Map(profiles.map(profile => [profile.user_id, toPlain(profile)]));

    return comments.map(comment => {
        const commentData = toPlain(comment);
        const user = userMap.get(comment.user_id) || {};
        const profile = profileMap.get(comment.user_id) || {};

        return {
            ...commentData,
            handle: user.handle,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_picture: profile.profile_picture,
            profile_bio: profile.profile_bio
        };
    });
}

async function createComment(comment) {
    const numericPostId = Number(comment.post_id);
    const numericUserId = Number(comment.user_id);
    const comment_id = await getNextSequence("comments");

    await Comment.create({
        comment_id,
        post_id: numericPostId,
        user_id: numericUserId,
        comment_content: comment.comment_content
    });

    return await getCommentsByPostId(numericPostId);
}

async function deleteComment(comment_id) {
    await Comment.deleteOne({ comment_id: Number(comment_id) });

    return { message: "Comment deleted successfully." };
}

module.exports = {
    getCommentsByPostId,
    createComment,
    deleteComment
};
