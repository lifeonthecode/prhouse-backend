const cloudinary = require("cloudinary");
const { errorResponse, streamUpload } = require("../utils/utils");
const Post = require("../models/post.model");


const createPost = async (req, res) => {
    try {

        const { title, description } = req.body;
        if (!title || !description || !req.file) {
            return errorResponse(res, 404, 'Please Title, Description, Image Or Video required!')
        }

        const resource_type = req.file.mimetype.startsWith("image") ? "image" : "video";
        const folder = resource_type === "image" ? "images" : "videos";
        const result = await streamUpload(req, folder);


        await Post.create({
            title,
            description,
            post: {
                url: result.secure_url,
                public_id: result.public_id
            },
            category: result.resource_type === "video" ? "reel" : "post",
            user: req.user.userId,
        });

        return res.status(200).json(
            {
                success: true,
                message: "Post successfully created!",
            }
        )


    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
};


const getAllPosts = async (req, res) => {
    try {

        const { title } = req.query;

        let query = {};
        if (title) {
            query.title = { $regex: title, $options: "i" }
        }

        const posts = await Post.find(query)
            .populate("user", "-password").sort({ createdAt: -1 });
        return res.status(200).json(
            {
                success: true,
                message: "Fetched All Posts",
                posts
            }
        )

    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}


const getPosts = async (req, res) => {
    try {
        const { title } = req.query;

        let query = { category: 'post' };
        if (title) {
            query.title = { $regex: title, $options: "i" }
        }

        const posts = await Post.find(query).populate("user", "-password").sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: 'Fetched Posts',
            posts
        });

    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}

const getReels = async (req, res) => {
    try {

        const { title } = req.query;

        let query = { category: 'reel' };
        if (title) {
            query.title = { $regex: title, $options: "i" }
        }

        const reels = await Post.find(query).populate("user", "-password").sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: 'Fetched Reels',
            reels
        });

    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}



const getUserPosts = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return errorResponse(res, 404, 'ID Required!')
        }
        const posts = await Post.find({ user: id, category: 'post' }).populate("user", "-password").sort({ createdAt: -1 });
        if (posts.length === 0) {
            return errorResponse(res, 404, 'No post found for this user')
        };

        return res.status(200).json({
            success: true,
            message: 'Fetched user posts',
            posts
        });

    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}


const getUserReels = async (req, res) => {
    try {

        const { id } = req.params;
        if (!id) {
            return errorResponse(res, 404, 'ID Required!')
        }
        const reels = await Post.find({ user: id, category: 'reel' }).populate("user", "-password").sort({ createdAt: -1 });
        if (reels.length === 0) {
            return errorResponse(res, 404, 'No post found for this user')
        };

        return res.status(200).json({
            success: true,
            message: 'Fetched user reels',
            reels
        });

    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}


const deleteUserSinglePost = async (req, res) => {
    try {

        const { id } = req.params;
        if (!id) {
            return errorResponse(res, 404, "Please User Id & Post Id Required!")
        }
        const deletedPost = await Post.findOneAndDelete({
            user: req.user.userId,
            _id: id
        });

        if (!deletedPost) {
            return errorResponse(res, 404, 'User post not found');
        }

        return res.status(200).json(
            {
                success: true,
                message: 'Post deleted success'
            }
        )

    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}



module.exports = {
    createPost,
    getAllPosts,
    getPosts,
    getReels,
    getUserPosts,
    getUserReels,
    deleteUserSinglePost,
}