import asyncHandler from "../utils/asyncHandler.js";
import Post from "../model/Post.js";
import User from "../model/User.js";
import { apiResponse } from "../utils/apiResponse.js";

export const createPost = asyncHandler(async (req, res) => {
  const { description, picturePath } = req.body;
  console.log("req.user", req.user);
  const user = await User.findById(req.user?._id);
  const newPost = new Post({
    userId: req.user?._id,
    username: user.username,
    location: user.location,
    description,
    picturePath,
    userPicturePath: user.picturePath,
    likes: {},
    comments: [],
  });
  await newPost.save();
  const post = await Post.find();
  res.status(201).json(new apiResponse(201, post ,"Post created successfully"));
});


export const getFeedPosts = async (req, res) => {
  const post = await Post.find();
  res
    .status(200)
    .json(new apiResponse(200 , post, "Posts fetched successfully"));
};

export const getUserPosts = async (req, res) => {
  const { userId } = req.params;
  const post = await Post.find({ userId });
  res
    .status(200)
    .json(new apiResponse(200 , post, "Posts fetched successfully"));
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user._id;
  const post = await Post.findById(id);
  const isLiked = post.likes.get(userId);
  if (isLiked) {
    post.likes.delete(userId);
  } else {
    post.likes.set(userId, true);
  }
  const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes });
  res
    .status(200)
    .json(new apiResponse(200, updatedPost, "Post liked successfully"));
};
