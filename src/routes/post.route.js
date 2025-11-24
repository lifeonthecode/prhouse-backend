const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createPost, getAllPosts, getPosts, getReels, getUserPosts, getUserReels, deleteUserSinglePost } = require("../controllers/post.controller");
const { uploadFile } = require("../utils/utils");

const postRouter = express.Router();

postRouter.get('/get-posts', authMiddleware, getAllPosts);
postRouter.get('/get-only-posts', authMiddleware, getPosts);
postRouter.get('/get-reels', authMiddleware, getReels);

postRouter.get('/get-user-posts/:id', authMiddleware, getUserPosts);
postRouter.get('/get-user-reels/:id', authMiddleware, getUserReels);

postRouter.delete('/delete-user-single-post/:id', authMiddleware, deleteUserSinglePost);

postRouter.post('/create', uploadFile.single('file'), authMiddleware, createPost)


module.exports = postRouter;