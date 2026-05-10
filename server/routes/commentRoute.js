const express= require("express");
const router = express.Router();
const Comment = require("../models/commentModel");

router
    .post("/createComment", async (req, res) => {
        try {
            const comment = await Comment.createComment(req.body);
            res.json(comment);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })
    .get("/getCommentsByPostId/:post_id", async (req, res) => {
        try {
            const comments = await Comment.getCommentsByPostId(req.params.post_id);
            res.json(comments);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })
    .delete("/deleteComment/:comment_id", async (req, res) => {
        try {
            await Comment.deleteComment(req.params.comment_id);
            res.json({ message: "Comment deleted successfully" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

module.exports = router;