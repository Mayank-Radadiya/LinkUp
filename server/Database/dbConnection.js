import dotenv from "dotenv";
import mongoose from "mongoose";
import { users, posts } from "../data/index.js";
import User from "../model/User.js";
import Post from "../model/Post.js";

dotenv.config();

const dbConnection = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB successfully");

    // await User.insertMany(users);
    // await Post.insertMany(posts);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

export default dbConnection;
