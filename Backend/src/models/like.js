const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


LikeSchema.index({ likedBy: 1, post: 1 }, { unique: true });


LikeSchema.pre("save", async function (next) {
  try {
    const indexes = await mongoose.connection.db.collection("likes").indexes();
    const invalidIndex = indexes.find(
      (i) => i.key && i.key.likedBy === 1 && Object.keys(i.key).length === 1 && i.unique
    );
    if (invalidIndex) {
      await mongoose.connection.db.collection("likes").dropIndex(invalidIndex.name);
      console.log("❌ Removed incorrect unique index on likedBy");
    }
  } catch (err) {
    console.error("Error while checking/removing old indexes:", err.message);
  }
  next();
});

const Like = mongoose.model("Like", LikeSchema);
module.exports = Like;
