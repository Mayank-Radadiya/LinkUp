import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import dotenv from "dotenv";
import User from "../model/User.js";
dotenv.config();

export const verifyToken = asyncHandler(async (req, res, next) => {
  let token =
    req.cookies?.authorization ||
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.header("authorization")?.replace("Bearer ", "");
    console.log("token :   ===", token);
  // Check if the token is missing
  if (!token) {
    throw new apiError(401, "Unauthorized");
  }

  // Remove "Bearer " prefix from the token if present
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  // Verify the token and decode it
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decodedToken?.userId).select("-password");
  if (!user) {
    throw new apiError(401, "Invalid token - User not found");
  }

  req.user = user;
  // Proceed to the next middleware
  next();
});
