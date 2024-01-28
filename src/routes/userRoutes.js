import express from "express";
import { getPostedPhotoList, getStoredPhotoList, getUserInfo, updateUser } from "../controllers/userControllers.js";

import { apiKey } from "../config/jwt.js";

const userRoutes = express.Router();

userRoutes.get("/get-userInfo", apiKey, getUserInfo)
userRoutes.get("/get-storedPhotoList", getStoredPhotoList)
userRoutes.get("/get-postedPhotoList", apiKey, getPostedPhotoList)
userRoutes.put("/update-user", updateUser)

export default userRoutes