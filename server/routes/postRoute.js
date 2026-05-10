const express = require("express")
const router = express.Router()
const Post = require("../models/postModel")

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
.post('/createPost', async (req, res) => {
    try {
        const posts = await Post.createPost(req.body)
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

module.exports = router