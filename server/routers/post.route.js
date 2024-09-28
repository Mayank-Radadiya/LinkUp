import express from "express";
import { getFeedPosts } from "../controllers/post.controller.js";
const router = express.Router();

router.get("/", getFeedPosts);

export default router;