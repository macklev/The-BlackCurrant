const express = require("express")
const router = express.Router()
const Post = require("../models/postModel")
const upload = require("../middleware/upload")

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
        const postData = {
            user_id: req.body.user_id,
            post_content: req.body.post_content,
            media: req.files || []
        };
        const posts = await Post.createPost(postData)
        res.send(posts)
    } catch(err) {
        res.status(401).send({message: err.message})
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
.delete('/deletePost/:post_id', async (req, res) => {
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