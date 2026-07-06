const express = require("express")
const router = express.Router()
const Post = require("../models/postModel")
const upload = require("../middleware/upload")
const cloudinary = require("../config/cloudinary")

router
.get('/getAllPosts', async (req, res) => {
    try {
        const posts = await Post.getAllPosts()
        res.send(posts)
    } catch(err) {
        res.status(401).send({message: err.message})
    }
})
.get('/getPostsByUserId/:user_id', async (req, res) => {
    try {
        const posts = await Post.getPostsByUserId(req.params.user_id)
        res.json(posts)
    } catch(err) {
        res.status(401).json({message: err.message})
    }
})
.post('/createPost', upload.array('media', 5), async (req, res) => {
    try {

        const uploadedMedia = [];

        if (req.files && req.files.length > 0) {

            for (const file of req.files) {

                const result = await new Promise((resolve, reject) => {

                    cloudinary.uploader.upload_stream(
                        {
                            folder: `blackcurrant/users/${req.body.user_id}/posts`,
                            resource_type: "auto"
                        },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    ).end(file.buffer);

                });

                uploadedMedia.push({
                    filePath: result.secure_url,
                    public_id: result.public_id,
                    fileType: result.resource_type === "video"
                        ? "video"
                        : "image",
                    fileName: file.originalname,
                    mimeType: file.mimetype
                });
            }
        }


        const postData = {
            user_id: req.body.user_id,
            post_content: req.body.post_content,
            media: uploadedMedia
        };


        const posts = await Post.createPost(postData);

        res.send(posts);

    } catch(err) {
        console.error("Cloudinary upload error:", err);
        res.status(500).send({
            message: err.message
        });
    }
})
.put('/updatePost/:post_id', async (req, res) => {
    try {
        const posts = await Post.updatePost(req.params.post_id, req.body)
        res.send(posts)
    } catch(err) {
        res.status(401).send({message: err.message})
    }
})
.delete('/deletePost/:post_id/:user_id', async (req, res) => {
    try {
        const posts = await Post.deletePost(req.params.post_id)
        res.send(posts)
    } catch(err) {
        res.status(401).send({message: err.message})
    }
})
.get("/feed/:user_id", async (req, res) => {
    try {
        const posts = await Post.getFeedPosts(req.params.user_id);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

module.exports = router