import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization;

  // Check if the token is missing
  if (!token) {
    throw new apiError(401, "Unauthorized");
  }

  // Remove "Bearer " prefix from the token if present
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  // Verify the token and decode it
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Attach decoded user info to the request
  req.user = decoded;

  // Proceed to the next middleware
  next();
});
