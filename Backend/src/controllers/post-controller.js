const Post = require("../models/post");
const User = require("../models/user");
const { uploadSingleImage } = require("../services/cloudinary");


exports.createPost = async (req, res) => {
    try {
        const { user_id } = req.query;

        const userExists = await User.findById(user_id);

        if (!userExists) {
            return res.status(400).json({
                success: false,
                message: "User Id is Not Exists"
            });
        }
        const { title, description, tags, location, postedBy, likes, comments } = req.body;
        let image = null;
        if (req.file) {
            const uploadedImage = await uploadSingleImage(req.file.path);
            if (uploadedImage) {
                image = uploadedImage.secure_url
            }
        }
        const newPost = await Post.create({ image, title, description, tags, location, postedBy, likes, comments });
        return res.status(201).json({
            success: true,
            message: "Post Creation Successfully",
            newPost
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.getPostById = async (req, res) => {
    try {
        const { post_id } = req.query;
        const postData = await Post.findById({ _id: post_id });
        if (!postData) {
            res.status(400).json({
                success: false,
                message: "Post not Exists",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Get Data by Post Id Successfully",
            postData
        })
    }
    catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

exports.getPostByUserId = async (req, res) => {
    try {
        const { user_id } = req.query;
        const userPosts = await Post.find({ postedBy: user_id });
        if (!userPosts || userPosts.length === 0) {
            res.status(400).json({
                success: false,
                message: "UserPosts is not here opr Empty"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Get All Post of the User successfully",
            userPosts
        })
    }
    catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

exports.updatePostById = async (req, res) => {
    try {
        const { post_id } = req.query;
        let updateObject = {};

        const { title, tags, description } = req.body;

        if (title) updateObject.title = title;
        if (tags) updateObject.tags = tags;
        if (description) updateObject.description = description;

        const update_post = await Post.findByIdAndUpdate(post_id, updateObject, {
            new: true,
            runValidators: true
        });
        if (!update_post) {
            res.status(400).json({
                success: false,
                message: "Post not Exists"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Post updated successfully!",
            update_post
        });

    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.deletePostById = async (req, res) => {
    try {
        const { post_id } = req.query;
        const deletedPost = await Post.findByIdAndDelete({ _id: post_id });
        if (!deletedPost) {
            res.status(400).json({
                success: false,
                message: "Post not exists or not deleted etc.."
            })
        }
        return res.status(200).json({
            success: true,
            message: "Post Deletion Successfully"
        })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.deletePostByUserId = async (req, res) => {
    try {
        const { user_id } = req.query;
        const deletedPost = await Post.findByIdAndDelete({ postedBy: user_id });
        if (!deletedPost) {
            res.status(400).json({
                success: false,
                message: "Post not exists or not deleted etc.."
            })
        }
        return res.status(200).json({
            success: true,
            message: "All Post Deletion Successfully"
        })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("postedBy", "username email") 
            .populate("comments.commentedBy", "username email")
            .sort({ createdAt: -1 }); 
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error" });
    }
};