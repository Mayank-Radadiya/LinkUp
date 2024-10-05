import asyncHandler from "../utils/asyncHandler.js";
import User from "../model/User.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";


export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.status(200).json(new apiResponse(200, user, "User fetched successfully"));
});

// export const getUserFriends = asyncHandler(async (req, res) => {
//  const userInfo = req.user;

//   if (!mongoose.Types.ObjectId.isValid(userInfo.id)) {
//     return res.status(400).json(new apiResponse(400, "Invalid user ID", null));
//   }

//   const user = await User.findById(userInfo.id);
//     if (!user) {
//       return res.status(404).json(new apiResponse(404, "User not found", null));
//     }

//   const friends = await Promise.all(
//     user.friends.map((id) => User.findById(id))
//   );
//   const formattedFriends = friends.map(
//     ({ _id, username, occupation, location, picturePath }) => {
//       return { _id, username, occupation, location, picturePath };
//     }
//   );
//   res
//     .status(200)
//     .json(
//       new apiResponse(200, formattedFriends, "Friends fetched successfully")
//     );
// });
export const getUserFriends = asyncHandler(async (req, res) => {
  const userInfo = req.user;

  if (!userInfo || !userInfo.id) {
    return res
      .status(400)
      .json(new apiResponse(400,null , "User information is missing"));
  }

  try {
    const user = await User.findById(userInfo.id);
    if (!user) {
      return res.status(404).json(new apiResponse(404, null, "User not found"));
    }

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
      .json(
        new apiResponse(200, formattedFriends, "Friends fetched successfully")
      );
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(400)
        .json(new apiResponse(400, "Invalid user ID format", null));
    }
    throw error; // Let the asyncHandler deal with other types of errors
  }
});

export const addRemoveFriend = asyncHandler(async (req, res) => {
  const { id, friendId } = req.params;

  const user = await User.findById(id);
  const friend = await User.findById(friendId);

  if (user.friends.includes(friendId)) {
    user.friends = user.friends.filter((id) => id !== friendId);
    friend.friends = friend.friends.filter((id) => id !== id);
  } else {
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

  res
    .status(200)
    .json(
      new apiResponse(200, formattedFriends, "Friendship updated successfully")
    );
});
