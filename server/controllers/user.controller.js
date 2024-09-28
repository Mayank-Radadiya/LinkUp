import asyncHandler from "../utils/asyncHandler.js";
import User from "../model/User.js";
import { apiResponse } from "../utils/apiResponse.js";

export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.status(200).json(apiResponse(200, "User fetched successfully", user));
});

export const getUserFriends = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );
  const formattedFriends = friends.map(
    ({ _id, username, occupation, location, picturePath }) => {
      return { _id, username, occupation, location, picturePath };
    }
  );
  res
    .status(200)
    .json(apiResponse(200, "Friends fetched successfully", formattedFriends));
});

export const addRemoveFriend = asyncHandler(async (req, res) => {
  const { id, friendId } = req.params;
  
  const user = await User.findById(id);
  const friend = await User.findById(friendId);

  if(user.friends.includes(friendId)){
    user.friends = user.friends.filter((id) => id !== friendId);
    friend.friends = friend.friends.filter((id) => id !== id);
  }else{
    user.friends.push(friendId);
    friend.friends.push(id);
  }

  await user.save();
  await friend.save();

  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );

  const formattedFriends = friends.map(
    ({ _id, username, occupation, location, picturePath }) => {
      return { _id, username, occupation, location, picturePath };
    }
  );

  res.status(200).json(apiResponse(200, "Friendship updated successfully", formattedFriends));
});
