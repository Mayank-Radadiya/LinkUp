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

export const login = asyncHandler(async (req,res) => {
  res.send("login")
})
