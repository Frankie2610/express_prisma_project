import express from "express";
import { createComment, deletePostedPhoto, getComment, getPhotoInfo, getPhotoList, searchPhotoList } from "../controllers/photoControllers.js";
import { apiKey } from "../config/jwt.js";


const photoRoutes = express.Router()

// photoRoutes.get("/get-photo", getPhotoList)
photoRoutes.get("/get-photoList", apiKey, getPhotoList)
photoRoutes.get("/get-photoName/:photoName", apiKey, searchPhotoList)
photoRoutes.get("/get-photoInfo/:photoId", apiKey, getPhotoInfo)
photoRoutes.get("/get-comment/:photoId", apiKey, getComment)
photoRoutes.post("/create-comment/:photoId", apiKey, createComment)
photoRoutes.delete("/delete-postedPhoto/:photoId", apiKey, deletePostedPhoto)

export default photoRoutes