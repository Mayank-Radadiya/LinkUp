import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { CloudinaryUploadFile } from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";

/* REGISTER USER */
export const register = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    username,
    picturePath,
    friends,
    location,
    occupation,
  } = req.body;

  // Check if any field is empty
  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "password",
    "username",
    "picturePath",
    "friends",
    "location",
    "occupation",
  ];

  const missingField = requiredFields.find((field) => !req.body[field]?.trim());

  if (missingField) {
    return res
      .status(400)
      .json(new apiError(400, `The field "${missingField}" is required`));
  }

  // Check if the email  and username is already in use
  const emailExists = await User.findOne({ email });
  const usernameExists = await User.findOne({ username });
  if (emailExists) {
    throw new apiError(400, "Email already in use");
  }
  if (usernameExists) {
    return new apiError(400, "Username already in use");
  }
  
  // Hash the password
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  // Upload the file to Cloudinary
  const avatar = await CloudinaryUploadFile(picturePath);
  if (!avatar) {
    return res.status(400).json(new apiError(400, "Failed to upload avatar"));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashPassword,
    username,
    picturePath: avatar.url,
    friends,
    location,
    occupation,
    viewedProfile: Math.floor(Math.random() * 10000),
    impressions: Math.floor(Math.random() * 10000),
  });

  const createdUser = await User.findById(user._id).select("-password ");

  if (!createdUser) {
    throw new apiError(500, "User registration failed");
  }
  // const saveUser = await newUser.save();
  res.status(201).json(new apiResponse(200, user, "User created successfully"));
});


/* LOGIN USER */

export const login = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    throw new apiError(400, "Email/Username and password are required");
  }

  // Find user by email or username
  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!user) {
    throw new apiError(401, "Invalid credentials");
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new apiError(
      401,
      "Invalid password, please enter the correct password"
    );
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });

  // Remove password from user object
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  // Cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  };
  // Set the token as a cookie and also in the Authorization header
  res
    .status(200)
    .cookie("authorization", token, options)
    .header("Authorization", `Bearer ${token}`) // Optional, depends on frontend handling
    .json(
      new apiResponse(
        200,
        { user: userWithoutPassword, token },
        "Login successful"
      )
    );
});







