// const Like = require('./models/like');
// const Post = require('./models/post');

// // Add a like to a post
// exports.addLike = async (req, res) => {
//   try {
//     const { likedBy, post } = req.body;

//     // Check if the like already exists
//     const existingLike = await Like.findOne({ likedBy, post });
//     if (existingLike) {
//       return res.status(400).json({ error: 'You have already liked this post' });
//     }

//     // Create a new like
//     const newLike = new Like({ likedBy, post });
//     await newLike.save();

//     // Optionally, update the post's like count (if required)
//     await Post.findByIdAndUpdate(post, { $addToSet: { likes: likedBy } });

//     res.status(201).json({ message: 'Post liked successfully', like: newLike });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Remove a like from a post
// exports.removeLike = async (req, res) => {
//   try {
//     const { likedBy, post } = req.body;

//     // Find and remove the like
//     const like = await Like.findOneAndDelete({ likedBy, post });
//     if (!like) {
//       return res.status(404).json({ error: 'Like not found' });
//     }

//     // Optionally, update the post's like count (if required)
//     await Post.findByIdAndUpdate(post, { $pull: { likes: likedBy } });

//     res.status(200).json({ message: 'Like removed successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get all likes for a specific post
// exports.getLikesForPost = async (req, res) => {
//   try {
//     const { postId } = req.params;

//     // Retrieve all likes for the post
//     const likes = await Like.find({ post: postId }).populate('likedBy', 'name');

//     res.status(200).json(likes);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
