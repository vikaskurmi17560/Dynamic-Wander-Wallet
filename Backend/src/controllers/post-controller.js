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
        message: "User Id does not exist",
      });
    }

    const { title, description, tags, location, postedBy, likes, comments } = req.body;

    let image = null;
    if (req.file) {
      const uploadedImage = await uploadSingleImage(req.file.path);
      if (uploadedImage) {
        image = uploadedImage.secure_url;
      }
    }

    const newPost = await Post.create({
      image,
      title,
      description,
      tags,
      location,
      postedBy,
      likes,
      comments,
    });

    await User.findByIdAndUpdate(user_id, { $inc: { badge_point: 50 } });
    await User.findByIdAndUpdate(user_id, { $push: { posts: newPost._id } });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      newPost,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



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
    const { userId } = req.params;
    const posts = await Post.find({ userId });

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No posts found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


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
    const { userId } = req.body;
    const deletedPost = await Post.findByIdAndDelete({ _id: post_id });
    if (!deletedPost) {
      res.status(400).json({
        success: false,
        message: "Post not exists or not deleted etc.."
      })
    }

    await User.findByIdAndUpdate(userId, { $inc: { badge_point: -50 } });
    await User.findByIdAndUpdate(userId, { $pull: { posts: post_id } });

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

    const deletedPosts = await Post.find({ postedBy: user_id });
    const deletedPostIds = deletedPosts.map(post => post._id);

    const deleteResult = await Post.deleteMany({ postedBy: user_id });

    if (deleteResult.deletedCount === 0) {
      return res.status(400).json({
        success: false,
        message: "No posts found for this user.",
      });
    }
    await User.findByIdAndUpdate(user_id, {
      $pull: { posts: { $in: deletedPostIds } },
      $inc: { badge_point: -(50 * deleteResult.deletedCount) },
    });

    return res.status(200).json({
      success: true,
      message: `${deleteResult.deletedCount} post(s) deleted successfully.`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



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


exports.addLike = async (req, res) => {
  try {
    const { user_id, post_id } = req.body;

    if (!user_id || !post_id) {
      return res.status(400).json({
        success: false,
        message: "user_id and post_id are required",
      });
    }

    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }


    const existingLikeIndex = post.likes.findIndex(
      (like) => like.likedBy.toString() === user_id
    );

    if (existingLikeIndex !== -1) {

      post.likes.splice(existingLikeIndex, 1);
      await post.save();

      return res.status(200).json({
        success: true,
        message: "Like removed successfully",
      });
    } else {

      post.likes.push({ likedBy: user_id });
      await post.save();

      return res.status(201).json({
        success: true,
        message: "Post liked successfully",
        like: { likedBy: user_id },
      });
    }
  } catch (error) {
    console.error("Error in addLike:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


exports.getLikesForPost = async (req, res) => {
  try {
    const { post_id } = req.query;

    const post = await Post.findById(post_id).populate("likes.likedBy", "name email");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Likes retrieved successfully",
      likes: post.likes,
    });
  } catch (error) {
    console.error("Error in getLikesForPost:", error);
    res.status(500).json({ error: error.message });
  }
};



exports.addComment = async (req, res) => {
  try {
    const { user_id, text, post_id } = req.body;

    if (!user_id || !text || !post_id) {
      return res.status(400).json({
        success: false,
        message: "user_id, post_id and comment text are required",
      });
    }

    const user = await User.findById(user_id);
    const post = await Post.findById(post_id);

    if (!user || !post) {
      return res.status(404).json({
        success: false,
        message: "User or Post not found",
      });
    }

    const newComment = {
      text,
      commentedBy: user_id,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCommentsByPostId = async (req, res) => {
  try {
    const { post_id } = req.query;

    const post = await Post.findById(post_id).populate('comments.commentedBy', 'name profile');

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const comments = post.comments
      .map((comment) => ({
        _id: comment._id,
        text: comment.text,
        createdAt: comment.createdAt,
        user: {
          _id: comment.commentedBy._id,
          name: comment.commentedBy.name,
          profile: comment.commentedBy.profile || '',
        },
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching comments' });
  }
};


exports.getCommentsByUserId = async (req, res) => {
  try {
    const { user_id } = req.query;

    const posts = await Post.find({ 'comments.commentedBy': user_id }).select('title comments');

    const commentsByUser = [];

    posts.forEach(post => {
      post.comments.forEach(comment => {
        if (comment.commentedBy.toString() === user_id) {
          commentsByUser.push({
            postTitle: post.title,
            text: comment.text,
            createdAt: comment.createdAt,
          });
        }
      });
    });

    if (commentsByUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No comments found by this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments: commentsByUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







exports.deleteCommentById = async (req, res) => {
  try {
    const { comment_id, post_id } = req.query;

    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const comment = post.comments.id(comment_id);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    comment.remove();
    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
