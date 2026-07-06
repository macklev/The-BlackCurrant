const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        user_id: {
            type: Number,
            unique: true,
            index: true
        },
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        handle: {
            type: String,
            required: true,
            unique: true
        }
    },
    { versionKey: false }
);

const profileSchema = new mongoose.Schema(
    {
        profile_id: {
            type: Number,
            unique: true,
            index: true
        },
        profile_picture: String,
        profile_bio: String,
        user_id: {
            type: Number,
            unique: true,
            required: false
        }
    },
    { versionKey: false }
);

const postSchema = new mongoose.Schema(
    {
        post_id: {
            type: Number,
            unique: true,
            index: true
        },
        user_id: {
            type: Number,
            required: true,
            index: true
        },
        post_content: {
            type: String,
            required: true,
            maxlength: 280
        },
        media: [
            {
                fileName: String,
                filePath: String,
                fileType: String, // 'image' or 'video'
                mimeType: String,
                uploadedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        date_created: {
            type: Date,
            default: Date.now
        }
    },
    { versionKey: false }
);

const commentSchema = new mongoose.Schema(
    {
        comment_id: {
            type: Number,
            unique: true,
            index: true
        },
        post_id: {
            type: Number,
            required: true,
            index: true
        },
        user_id: {
            type: Number,
            required: true,
            index: true
        },
        comment_content: {
            type: String,
            required: true,
            maxlength: 280
        },
        date_created: {
            type: Date,
            default: Date.now
        }
    },
    { versionKey: false }
);

const friendSchema = new mongoose.Schema(
    {
        friendship_id: {
            type: Number,
            unique: true,
            index: true
        },
        user_id: {
            type: Number,
            required: true,
            index: true
        },
        friend_id: {
            type: Number,
            required: true,
            index: true
        },
        date_created: {
            type: Date,
            default: Date.now
        }
    },
    { versionKey: false }
);

friendSchema.index({ user_id: 1, friend_id: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Profile = mongoose.models.Profile || mongoose.model("Profile", profileSchema);
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
const Friend = mongoose.models.Friend || mongoose.model("Friend", friendSchema);

module.exports = {
    User,
    Profile,
    Post,
    Comment,
    Friend
};
