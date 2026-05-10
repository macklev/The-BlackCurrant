const express = require("express");
const router = express.Router();
const Friend = require("../models/friendModel");

router
    .post("/addFriend", async (req, res) => {
        try {
            const friends = await Friend.addFriend(req.body.user_id, req.body.friend_id);
            res.json(friends);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })

    .get("/getFriends/:user_id", async (req, res) => {
        try {
            const friends = await Friend.getFriends(req.params.user_id);
            res.json(friends);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })

    .delete("/removeFriend/:user_id/:friend_id", async (req, res) => {
        try {
            const friends = await Friend.removeFriend(
                req.params.user_id,
                req.params.friend_id
            );
            res.json(friends);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

module.exports = router;