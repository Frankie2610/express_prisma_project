import express from "express";
import { getPostedPhotoList, getStoredPhotoList, getUserInfo, updateUser } from "../controllers/userControllers.js";

import { apiKey } from "../config/jwt.js";

const userRoutes = express.Router();

userRoutes.get("/get-user-info", apiKey, getUserInfo)
userRoutes.get("/get-stored-photo-list", apiKey, getStoredPhotoList)
userRoutes.get("/get-posted-photo-list", apiKey, getPostedPhotoList)
userRoutes.put("/update-user", apiKey, updateUser)

export default userRoutes