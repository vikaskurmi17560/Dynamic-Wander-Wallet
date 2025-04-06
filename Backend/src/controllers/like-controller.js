const Like = require('../models/like');
const Post = require('../models/post');


exports.addLike = async (req, res) => {
    try {
      const { user_id, post_id } = req.body;
      
      if (!user_id || !post_id) {
        return res.status(400).json({
          success: false,
          message: "user_id and post_id are required",
        });
      }
   
      const existingLike = await Like.findOne({ likedBy: user_id, post: post_id });
      if (existingLike) {
        await Like.findOneAndDelete({ likedBy: user_id, post: post_id });
        await Post.findByIdAndUpdate(post_id, { $pull: { likes: user_id } });
        return res.status(200).json({
            success:true,
            message: "Like removed successfully" 
            });
      }
  
     
      const newLike = await Like.create({  likedBy: user_id ,post: post_id});
  
     
      await Post.findByIdAndUpdate(post_id, { $addToSet: { likes: user_id } });
  
      res.status(201).json({
        success:true,
        message: 'Post liked successfully',
          like: newLike
         });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
 
  
  exports.getLikesForPost = async (req, res) => {
    try {
      const { post_id } = req.query;
  
      
      const likes = await Like.find({ post: post_id }).populate("likedBy", "name email");
  
      res.status(200).json({
        success:true,
        message:"Get All Likes post",
        likes
    });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };