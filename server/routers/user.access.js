import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getUser ,getUserFriends ,addRemoveFriend} from "../controllers/user.controller.js";

const router = express.Router();


router.get("/:id" , verifyToken ,getUser)
router.get("/friends" , verifyToken ,getUserFriends)

//Update
router.patch("/:id/:friendId" , verifyToken ,addRemoveFriend)


export default router;