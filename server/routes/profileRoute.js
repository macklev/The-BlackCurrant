const express = require("express");
const router = express.Router();
const Profile = require("../models/profileModel");

router
    .get("/getProfile/:user_id", async (req, res) => {
        try {
            const profile = await Profile.getProfileByUserId(req.params.user_id);
            res.json(profile);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })

    .post("/saveProfile", async (req, res) => {
        try {
            const profile = await Profile.createOrUpdateProfile(req.body);
            res.json(profile);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

module.exports = router;