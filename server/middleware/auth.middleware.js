import cookieParser from "cookie-parser";
import express from "express";
import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import dotenv from "dotenv";
import User from "../model/User.js";
dotenv.config();

const app = express();
app.use(cookieParser());

export const verifyToken = asyncHandler(async (req, res, next) => {


  let token =
    req.cookies?.authorization ||
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.header("authorization")?.replace("Bearer ", "") ||
    req.query.token; // Add support for token in query string


  // Check if the token is missing
  if (!token) {
    console.log("No token found in cookies, headers, or query string");
    throw new apiError(401, "Unauthorized - No token provided");
  }

  // Remove "Bearer " prefix from the token if present
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  try {
    // Verify the token and decode it
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken?.userId).select("-password");
    if (!user) {
      throw new apiError(401, "Invalid token - User not found");
    }

    req.user = user;
    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    throw new apiError(401, "Invalid or expired token");
  }
});
